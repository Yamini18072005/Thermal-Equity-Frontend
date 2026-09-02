"""Create a transparent normalized thermal vulnerability index from aligned rasters."""
from __future__ import annotations
import argparse
from pathlib import Path
import numpy as np
import rasterio


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lst", type=Path, required=True)
    parser.add_argument("--ndvi", type=Path, required=True)
    parser.add_argument("--ndbi", type=Path, required=True)
    parser.add_argument("--population", type=Path, required=True, help="Aligned real population or vulnerability raster")
    parser.add_argument("--output", type=Path, default=Path("gis/raster/thermal_equity_index.tif"))
    parser.add_argument("--weights", nargs=4, type=float, default=[0.4, 0.25, 0.2, 0.15], metavar=("LST", "NDVI_DEFICIT", "NDBI", "POPULATION"))
    args = parser.parse_args()
    rasters = [args.lst, args.ndvi, args.ndbi, args.population]
    if any(not path.is_file() for path in rasters):
        missing = [str(path) for path in rasters if not path.is_file()]
        raise SystemExit(f"WAITING_FOR_REAL_DATA: required index rasters missing: {', '.join(missing)}")
    with rasterio.open(args.lst) as first:
        if first.crs is None:
            raise SystemExit("LST raster has no CRS.")
        arrays = [first.read(1).astype("float32")]
        profile = first.profile.copy()
        for path in rasters[1:]:
            with rasterio.open(path) as source:
                if (source.shape, source.transform, source.crs) != (first.shape, first.transform, first.crs):
                    raise SystemExit(f"Raster grid mismatch: {path}")
                arrays.append(source.read(1).astype("float32"))
    weights = np.asarray(args.weights, dtype="float32")
    if not np.all(np.isfinite(weights)) or np.any(weights < 0) or weights.sum() <= 0:
        raise SystemExit("Weights must be finite, non-negative, and have a positive sum.")
    weights = weights / weights.sum()
    components = [arrays[0], -arrays[1], arrays[2], arrays[3]]
    valid = np.logical_and.reduce([np.isfinite(array) & (array != -9999) for array in components])
    result = np.full(components[0].shape, -9999, dtype="float32")
    for array, weight in zip(components, weights):
        values = array[valid]
        low, high = np.percentile(values, [2, 98])
        if high <= low:
            raise SystemExit("Cannot normalize an index component with no value range.")
        scaled = np.clip((array - low) / (high - low), 0, 1)
        result[valid] += weight * scaled[valid]
    profile.update(driver="GTiff", dtype="float32", count=1, nodata=-9999, compress="deflate", index_weights=','.join(map(str, weights)))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with rasterio.open(args.output, "w", **profile) as destination:
        destination.write(result, 1)
    print(f"WROTE {args.output}; weights={weights.tolist()}; direction=larger means greater vulnerability")


if __name__ == "__main__":
    main()
