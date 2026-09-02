"""Align a real raster to a real reference raster grid."""
from __future__ import annotations
import argparse
from pathlib import Path
import rasterio
from rasterio.warp import reproject, Resampling


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--reference", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--resampling", choices=("nearest", "bilinear", "average"), default="bilinear")
    args = parser.parse_args()
    for path in (args.input, args.reference):
        if not path.is_file():
            raise SystemExit(f"REQUIRED INPUT MISSING: real raster not found: {path}")
    method = {"nearest": Resampling.nearest, "bilinear": Resampling.bilinear, "average": Resampling.average}[args.resampling]
    with rasterio.open(args.input) as source, rasterio.open(args.reference) as reference:
        if source.crs is None or reference.crs is None:
            raise SystemExit("Both rasters must have CRS metadata.")
        profile = reference.profile.copy()
        destination_nodata = -9999
        profile.update(driver="GTiff", count=source.count, dtype="float32", nodata=destination_nodata, compress="deflate")
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with rasterio.open(args.output, "w", **profile) as destination:
            for band in range(1, source.count + 1):
                reproject(source=rasterio.band(source, band), destination=rasterio.band(destination, band), src_transform=source.transform, src_crs=source.crs, dst_transform=reference.transform, dst_crs=reference.crs, resampling=method, src_nodata=source.nodata, dst_nodata=destination_nodata)
    print(f"WROTE {args.output}; reference={args.reference}; resampling={args.resampling}")


if __name__ == "__main__":
    main()
