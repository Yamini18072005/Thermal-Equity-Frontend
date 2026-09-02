"""Export statistics and simple PNG previews for validated real rasters."""
from __future__ import annotations
import argparse
from pathlib import Path
import csv
import numpy as np
import rasterio
import matplotlib.pyplot as plt


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("rasters", nargs="+", type=Path)
    parser.add_argument("--stats", type=Path, default=Path("outputs/tables/raster_statistics.csv"))
    parser.add_argument("--maps", type=Path, default=Path("outputs/maps"))
    args = parser.parse_args()
    rows = []
    args.maps.mkdir(parents=True, exist_ok=True)
    for path in args.rasters:
        if not path.is_file():
            raise SystemExit(f"REQUIRED INPUT MISSING: raster not found: {path}")
        with rasterio.open(path) as source:
            values = source.read(1, masked=True)
            valid = values.compressed()
            if not len(valid):
                raise SystemExit(f"Raster has no valid pixels: {path}")
            rows.append({"dataset": path.name, "crs": str(source.crs), "bounds": tuple(round(x, 3) for x in source.bounds), "resolution": tuple(round(x, 6) for x in source.res), "width": source.width, "height": source.height, "nodata": source.nodata, "valid_pixel_count": len(valid), "min": float(valid.min()), "max": float(valid.max()), "mean": float(valid.mean()), "median": float(np.median(valid))})
            display = values.astype("float32").filled(np.nan)
        figure, axis = plt.subplots(figsize=(8, 6))
        image = axis.imshow(display, cmap="viridis")
        axis.set_title(path.stem)
        axis.set_axis_off()
        figure.colorbar(image, ax=axis, shrink=0.75)
        figure.tight_layout()
        figure.savefig(args.maps / f"{path.stem}.png", dpi=150)
        plt.close(figure)
    args.stats.parent.mkdir(parents=True, exist_ok=True)
    with args.stats.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0])
        writer.writeheader()
        writer.writerows(rows)
    print(f"WROTE {args.stats} rows={len(rows)} and maps={args.maps}")


if __name__ == "__main__":
    main()
