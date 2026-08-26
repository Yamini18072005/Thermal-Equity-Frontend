"""Crop and align a real population raster to the project analysis grid."""
from __future__ import annotations
import argparse
from pathlib import Path
import numpy as np
import rasterio
from rasterio.warp import reproject, Resampling


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True, help="Real WorldPop or official population GeoTIFF")
    parser.add_argument("--reference", type=Path, required=True, help="Validated common-grid raster")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if not args.input.is_file():
        raise SystemExit(f"WAITING_FOR_REAL_DATA: population raster not found: {args.input}")
    if not args.reference.is_file():
        raise SystemExit(f"REQUIRED INPUT MISSING: reference raster not found: {args.reference}")
    with rasterio.open(args.input) as source, rasterio.open(args.reference) as reference:
        if source.crs is None or reference.crs is None:
            raise SystemExit("Both population and reference rasters must have CRS metadata.")
        profile = reference.profile.copy()
        profile.update(driver="GTiff", dtype="float32", count=1, nodata=-9999, compress="deflate", units="persons per source cell", source_dataset=str(args.input))
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with rasterio.open(args.output, "w", **profile) as destination:
            reproject(source=rasterio.band(source, 1), destination=rasterio.band(destination, 1), src_transform=source.transform, src_crs=source.crs, dst_transform=reference.transform, dst_crs=reference.crs, resampling=Resampling.average, src_nodata=source.nodata, dst_nodata=-9999)
    with rasterio.open(args.output) as result:
        values = result.read(1, masked=True).compressed()
    if not len(values) or not np.isfinite(values).all() or (values < 0).any():
        raise SystemExit("Population raster failed validation: no valid non-negative values.")
    print(f"WROTE {args.output}; valid_pixels={len(values)}; source={args.input}; resampling=average")


if __name__ == "__main__":
    main()
