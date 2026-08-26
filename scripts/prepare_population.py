"""Validate an authoritative population table or vector without inventing values."""
from __future__ import annotations
import argparse
from pathlib import Path
import pandas as pd
import geopandas as gpd


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--key", required=True, help="Ward/zone identifier column")
    parser.add_argument("--population", required=True, help="Population or density column")
    args = parser.parse_args()
    if not args.input.is_file():
        raise SystemExit(f"REQUIRED INPUT MISSING: {args.input}")
    if args.input.suffix.lower() in {".gpkg", ".shp", ".geojson"}:
        data = gpd.read_file(args.input)
    else:
        data = pd.read_csv(args.input)
    missing = {args.key, args.population} - set(data.columns)
    if missing:
        raise SystemExit(f"Required columns missing: {sorted(missing)}")
    if data[args.key].isna().any() or data[args.population].isna().any():
        raise SystemExit("Population input contains missing join keys or population values.")
    if (pd.to_numeric(data[args.population], errors="coerce") < 0).any():
        raise SystemExit("Population input contains negative values.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(data, gpd.GeoDataFrame):
        data.to_file(args.output, layer=args.output.stem, driver="GPKG")
    else:
        data.to_csv(args.output, index=False)
    print(f"WROTE {args.output} rows={len(data)}")


if __name__ == "__main__":
    main()
