"""Acquire real WorldPop ward totals through the one-geometry-per-task API."""
from __future__ import annotations
import argparse
from concurrent.futures import ThreadPoolExecutor
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path
import geopandas as gpd
from shapely import force_2d
from shapely.geometry import mapping

API = "https://api.worldpop.org/v1/services/stats"
TASK = "https://api.worldpop.org/v1/tasks/{}"


def request_task(geometry: dict, year: int) -> str:
    payload = {"dataset": "wpgppop", "year": str(year), "geojson": json.dumps({"type": "Feature", "properties": {}, "geometry": geometry}, separators=(",", ":"))}
    request = urllib.request.Request(API, data=urllib.parse.urlencode(payload).encode(), method="POST", headers={"Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(request, timeout=120) as response:
        result = json.load(response)
    if result.get("error") or not result.get("taskid"):
        raise RuntimeError(result)
    return result["taskid"]


def get_task(taskid: str) -> dict:
    with urllib.request.urlopen(TASK.format(taskid), timeout=120) as response:
        return json.load(response)


def acquire_one(ward_id: str, geometry: dict, year: int, raw_dir: Path) -> dict:
    raw_path = raw_dir / f"ward_{ward_id}_worldpop.json"
    if raw_path.is_file():
        result = json.loads(raw_path.read_text(encoding="utf-8"))
    else:
        taskid = request_task(geometry, year)
        result = get_task(taskid)
        for _ in range(20):
            if result.get("status") in {"finished", "failed"}:
                break
            time.sleep(1)
            result = get_task(taskid)
        raw_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    if result.get("error") or result.get("status") != "finished" or "total_population" not in result.get("data", {}):
        raise RuntimeError(f"WorldPop task failed for ward {ward_id}: {result}")
    return {"ward": ward_id, "population": float(result["data"]["total_population"]), "source_year": year, "source": "WorldPop wpgppop statistics API", "task_id": result.get("taskid")}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--boundaries", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--raw-dir", type=Path, required=True)
    parser.add_argument("--year", type=int, default=2020)
    parser.add_argument("--key", default="ward")
    args = parser.parse_args()
    if not args.boundaries.is_file():
        raise SystemExit(f"REQUIRED INPUT MISSING: {args.boundaries}")
    wards = gpd.read_file(args.boundaries)
    if args.key not in wards.columns or wards.empty or wards.crs is None:
        raise SystemExit("Ward boundary must be non-empty, have CRS, and contain the requested key.")
    if wards.geometry.isna().any() or (~wards.geometry.is_valid).any():
        raise SystemExit("Ward geometry validation failed.")
    wards = wards.to_crs(4326)
    args.raw_dir.mkdir(parents=True, exist_ok=True)
    jobs = [(str(ward[args.key]), mapping(force_2d(ward.geometry).simplify(0.0001)), args.year, args.raw_dir) for _, ward in wards.iterrows()]
    with ThreadPoolExecutor(max_workers=8) as executor:
        rows = list(executor.map(lambda job: acquire_one(*job), jobs))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    import pandas as pd
    pd.DataFrame(rows).to_csv(args.output, index=False)
    print(f"WROTE {args.output}; wards={len(rows)}; total_population={sum(row['population'] for row in rows):.3f}")


if __name__ == "__main__":
    main()
