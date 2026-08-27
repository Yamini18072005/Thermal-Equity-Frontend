"""Derive Celsius LST from Landsat Collection 2 Level-2 ST_B10."""
from __future__ import annotations
import argparse
from pathlib import Path
import numpy as np
import rasterio
from rasterio.mask import mask
import geopandas as gpd

SCALE = 0.00341802
OFFSET = 149.0


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--thermal", type=Path, required=True, help="Landsat Collection 2 ST_B10")
    parser.add_argument("--output", type=Path, default=Path("gis/raster/chennai_lst.tif"))
    parser.add_argument("--qa-pixel", type=Path, help="Optional aligned QA_PIXEL raster")
    parser.add_argument("--boundary", type=Path)
    args = parser.parse_args()
    with rasterio.open(args.thermal) as source:
        raw = source.read(1).astype("float32")
        valid = np.isfinite(raw) & (raw > 0)
        if args.qa_pixel:
            with rasterio.open(args.qa_pixel) as qa:
                if (qa.shape, qa.transform, qa.crs) != (source.shape, source.transform, source.crs):
                    raise SystemExit("QA_PIXEL is not aligned with ST_B10.")
                flags = qa.read(1)
                cloud_bits = (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5)
                valid &= (flags & cloud_bits) == 0
        result = np.full(raw.shape, -9999, dtype="float32")
        result[valid] = raw[valid] * SCALE + OFFSET - 273.15
        profile = source.profile.copy()
        profile.update(driver="GTiff", dtype="float32", count=1, nodata=-9999, compress="deflate", units="degrees Celsius")
        if args.boundary:
            boundary = gpd.read_file(args.boundary).to_crs(source.crs)
            with rasterio.io.MemoryFile() as memory:
                with memory.open(**profile) as temp:
                    temp.write(result, 1)
                    clipped, transform = mask(temp, boundary.geometry, crop=True, nodata=-9999)
            result, profile = clipped[0], {**profile, "height": clipped.shape[1], "width": clipped.shape[2], "transform": transform}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with rasterio.open(args.output, "w", **profile) as destination:
        destination.write(result, 1)
    print(f"WROTE {args.output}; method=Collection 2 ST_B10 scale {SCALE} offset {OFFSET}, Kelvin to Celsius")


if __name__ == "__main__":
    main()
