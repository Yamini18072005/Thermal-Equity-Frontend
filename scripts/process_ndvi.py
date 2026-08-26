"""Calculate NDVI from aligned surface-reflectance NIR and red rasters."""
from __future__ import annotations
import argparse
from pathlib import Path
import numpy as np
import rasterio
from rasterio.mask import mask
import geopandas as gpd

REFLECTANCE_SCALE = 0.0000275
REFLECTANCE_OFFSET = -0.2


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--nir", type=Path, required=True)
    parser.add_argument("--red", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--boundary", type=Path)
    args = parser.parse_args()
    if not args.nir.is_file() or not args.red.is_file():
        raise SystemExit("REQUIRED INPUT MISSING: provide aligned, cloud-masked reflectance rasters.")
    with rasterio.open(args.nir) as nir_src, rasterio.open(args.red) as red_src:
        if (nir_src.shape, nir_src.transform, nir_src.crs) != (red_src.shape, red_src.transform, red_src.crs):
            raise SystemExit("NIR and red rasters are not aligned in shape, transform, or CRS.")
        nir = nir_src.read(1).astype("float32") * REFLECTANCE_SCALE + REFLECTANCE_OFFSET
        red = red_src.read(1).astype("float32") * REFLECTANCE_SCALE + REFLECTANCE_OFFSET
        valid = np.isfinite(nir) & np.isfinite(red) & (nir_src.read(1) != nir_src.nodata) & (red_src.read(1) != red_src.nodata) & (nir > 0) & (red > 0) & ((nir + red) != 0)
        result = np.full(nir.shape, -9999, dtype="float32")
        result[valid] = (nir[valid] - red[valid]) / (nir[valid] + red[valid])
        profile = nir_src.profile.copy()
        profile.update(driver="GTiff", dtype="float32", count=1, nodata=-9999, compress="deflate")
        if args.boundary:
            boundary = gpd.read_file(args.boundary).to_crs(nir_src.crs)
            with rasterio.io.MemoryFile() as memory:
                with memory.open(**profile) as temp:
                    temp.write(result, 1)
                    clipped, transform = mask(temp, boundary.geometry, crop=True, nodata=-9999)
            result, profile = clipped[0], {**profile, "height": clipped.shape[1], "width": clipped.shape[2], "transform": transform}
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with rasterio.open(args.output, "w", **profile) as dst:
            dst.write(result, 1)
    print(f"WROTE {args.output}; reflectance scale={REFLECTANCE_SCALE} offset={REFLECTANCE_OFFSET}; min={result[result != -9999].min() if np.any(result != -9999) else 'NA'} max={result[result != -9999].max() if np.any(result != -9999) else 'NA'}")


if __name__ == "__main__":
    main()
