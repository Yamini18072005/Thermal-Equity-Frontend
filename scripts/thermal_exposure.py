"""Calculate raster exposure summaries for validated polygon boundaries."""
from __future__ import annotations
import argparse
from pathlib import Path
import numpy as np
import pandas as pd
import geopandas as gpd
import rasterio
from rasterio.mask import mask


def create_exposure(raster: Path, output: Path) -> None:
    with rasterio.open(raster) as source:
        values = source.read(1).astype("float32")
        valid = np.isfinite(values) & (values != source.nodata) if source.nodata is not None else np.isfinite(values)
        if not valid.any():
            raise SystemExit("No valid LST pixels are available for exposure normalization.")
        low, high = np.percentile(values[valid], [2, 98])
        if high <= low:
            raise SystemExit("LST has no value range for exposure normalization.")
        result = np.full(values.shape, -9999, dtype="float32")
        result[valid] = np.clip((values[valid] - low) / (high - low), 0, 1) * 100
        profile = source.profile.copy()
        profile.update(driver="GTiff", dtype="float32", count=1, nodata=-9999, compress="deflate", normalization="2nd-98th percentile LST; 0-100 risk")
    output.parent.mkdir(parents=True, exist_ok=True)
    with rasterio.open(output, "w", **profile) as destination:
        destination.write(result, 1)
    print(f"WROTE {output}; normalization=p2..p98 LST; valid_pixels={int(valid.sum())}")


def summarize(raster: Path, boundaries: Path, output: Path, key: str) -> None:
    areas = gpd.read_file(boundaries)
    if key not in areas.columns:
        raise SystemExit(f"Boundary key column not found: {key}")
    rows = []
    with rasterio.open(raster) as source:
        areas = areas.to_crs(source.crs)
        for _, feature in areas.iterrows():
            clipped, _ = mask(source, [feature.geometry], crop=True, filled=False)
            values = clipped[0].compressed()
            rows.append({key: feature[key], "pixel_count": len(values), "mean": float(values.mean()) if values.size else np.nan, "median": float(np.median(values)) if values.size else np.nan, "min": float(values.min()) if values.size else np.nan, "max": float(values.max()) if values.size else np.nan})
    output.parent.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(rows).to_csv(output, index=False)
    print(f"WROTE {output} rows={len(rows)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raster", type=Path, required=True)
    parser.add_argument("--boundaries", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--key", required=True)
    parser.add_argument("--output-raster", type=Path, help="Optional normalized 0-100 LST exposure raster")
    args = parser.parse_args()
    if not args.raster.is_file() or not args.boundaries.is_file():
        raise SystemExit("REQUIRED INPUT MISSING: provide the raster and validated polygon boundary.")
    summarize(args.raster, args.boundaries, args.output, args.key)
    if args.output_raster:
        create_exposure(args.raster, args.output_raster)


if __name__ == "__main__":
    main()
