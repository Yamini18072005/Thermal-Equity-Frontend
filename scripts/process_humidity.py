"""Map real Open-Meteo reanalysis humidity points to the common analysis grid."""
from __future__ import annotations
import argparse
import json
from pathlib import Path
import numpy as np
import rasterio
from pyproj import Transformer


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--reference", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--hour", default="2026-06-06T04:00")
    args = parser.parse_args()
    if not args.input.is_file():
        raise SystemExit(f"WAITING_FOR_REAL_DATA: humidity JSON not found: {args.input}")
    if not args.reference.is_file():
        raise SystemExit(f"REQUIRED INPUT MISSING: reference raster not found: {args.reference}")
    document = json.loads(args.input.read_text(encoding="utf-8"))
    points = []
    for item in document:
        times = item.get("hourly", {}).get("time", [])
        values = item.get("hourly", {}).get("relative_humidity_2m", [])
        if args.hour not in times:
            continue
        value = values[times.index(args.hour)]
        if value is not None:
            points.append((float(item["longitude"]), float(item["latitude"]), float(value)))
    if len(points) < 4:
        raise SystemExit("Humidity input has too few valid real source points.")
    with rasterio.open(args.reference) as reference:
        rows, cols = np.indices((reference.height, reference.width), dtype="float32")
        xs, ys = rasterio.transform.xy(reference.transform, rows, cols, offset="center")
        transformer = Transformer.from_crs(reference.crs, "EPSG:4326", always_xy=True)
        longitude, latitude = transformer.transform(np.asarray(xs), np.asarray(ys))
        longitude = np.asarray(longitude).reshape(reference.height, reference.width)
        latitude = np.asarray(latitude).reshape(reference.height, reference.width)
        result = np.full((reference.height, reference.width), -9999, dtype="float32")
        distances = np.stack([(longitude - lon) ** 2 + (latitude - lat) ** 2 for lon, lat, _ in points])
        nearest = np.argmin(distances, axis=0)
        for index, (_, _, value) in enumerate(points):
            result[nearest == index] = value
        profile = reference.profile.copy()
        profile.update(driver="GTiff", dtype="float32", count=1, nodata=-9999, compress="deflate", units="percent relative humidity", source_period=args.hour, method="nearest real reanalysis source point; model spatial resolution is coarser than 30 m")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with rasterio.open(args.output, "w", **profile) as destination:
        destination.write(result, 1)
    print(f"WROTE {args.output}; points={len(points)}; hour={args.hour}; method=nearest source point")


if __name__ == "__main__":
    main()
