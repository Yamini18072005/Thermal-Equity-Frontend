"""Calculate NDBI from aligned SWIR and NIR surface-reflectance rasters."""
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
    parser.add_argument("--swir", type=Path, required=True)
    parser.add_argument("--nir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--boundary", type=Path)
    args = parser.parse_args()
    with rasterio.open(args.swir) as swir_src, rasterio.open(args.nir) as nir_src:
        if (swir_src.shape, swir_src.transform, swir_src.crs) != (nir_src.shape, nir_src.transform, nir_src.crs):
            raise SystemExit("SWIR and NIR rasters are not aligned in shape, transform, or CRS.")
        swir = swir_src.read(1).astype("float32") * REFLECTANCE_SCALE + REFLECTANCE_OFFSET
        nir = nir_src.read(1).astype("float32") * REFLECTANCE_SCALE + REFLECTANCE_OFFSET
        valid = np.isfinite(swir) & np.isfinite(nir) & (swir_src.read(1) != swir_src.nodata) & (nir_src.read(1) != nir_src.nodata) & (swir > 0) & (nir > 0) & ((swir + nir) != 0)
        result = np.full(swir.shape, -9999, dtype="float32")
        result[valid] = (swir[valid] - nir[valid]) / (swir[valid] + nir[valid])
        profile = swir_src.profile.copy()
        profile.update(driver="GTiff", dtype="float32", count=1, nodata=-9999, compress="deflate")
        if args.boundary:
            boundary = gpd.read_file(args.boundary).to_crs(swir_src.crs)
            with rasterio.io.MemoryFile() as memory:
                with memory.open(**profile) as temp:
                    temp.write(result, 1)
                    clipped, transform = mask(temp, boundary.geometry, crop=True, nodata=-9999)
            result, profile = clipped[0], {**profile, "height": clipped.shape[1], "width": clipped.shape[2], "transform": transform}
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with rasterio.open(args.output, "w", **profile) as dst:
            dst.write(result, 1)
    print(f"WROTE {args.output}; reflectance scale={REFLECTANCE_SCALE} offset={REFLECTANCE_OFFSET}")


if __name__ == "__main__":
    main()
