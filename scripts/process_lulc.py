"""Clip a real ESA WorldCover GeoTIFF to a validated study boundary."""
from __future__ import annotations
import argparse
from pathlib import Path
import geopandas as gpd
import rasterio
from rasterio.mask import mask


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True, help="Downloaded ESA WorldCover GeoTIFF")
    parser.add_argument("--boundary", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if not args.input.is_file():
        raise SystemExit(f"WAITING_FOR_REAL_DATA: LULC input not found: {args.input}")
    if not args.boundary.is_file():
        raise SystemExit(f"REQUIRED INPUT MISSING: boundary not found: {args.boundary}")
    areas = gpd.read_file(args.boundary)
    if areas.empty or areas.crs is None or areas.geometry.isna().any() or (~areas.geometry.is_valid).any():
        raise SystemExit("Boundary failed validation.")
    with rasterio.open(args.input) as source:
        if source.crs is None:
            raise SystemExit("LULC raster has no CRS.")
        areas = areas.to_crs(source.crs)
        clipped, transform = mask(source, areas.geometry, crop=True)
        profile = source.profile.copy()
        profile.update(driver="GTiff", height=clipped.shape[1], width=clipped.shape[2], transform=transform, compress="deflate")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with rasterio.open(args.output, "w", **profile) as destination:
        destination.write(clipped)
    print(f"WROTE {args.output}; source={args.input}; classes are unchanged from ESA WorldCover")


if __name__ == "__main__":
    main()
