"""Inspect vector and raster datasets and report structural quality checks."""
from __future__ import annotations
import argparse
from pathlib import Path
import geopandas as gpd
import rasterio

ROOT = Path(__file__).resolve().parents[1]


def vector_report(path: Path) -> None:
    layer = gpd.read_file(path)
    missing = int(layer.isna().sum(numeric_only=False).sum())
    invalid = int((~layer.geometry.is_valid).sum()) if "geometry" in layer else 0
    print(f"VECTOR {path}: CRS={layer.crs} features={len(layer)} geometry={layer.geom_type.value_counts().to_dict()} bounds={tuple(layer.total_bounds)} invalid={invalid} missing_values={missing}")


def raster_report(path: Path) -> None:
    with rasterio.open(path) as src:
        values = src.read(masked=True)
        print(f"RASTER {path}: CRS={src.crs} bounds={src.bounds} size={src.width}x{src.height} resolution={src.res} bands={src.count} dtype={src.dtypes} nodata={src.nodata} min={values.min()} max={values.max()}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("paths", nargs="*", type=Path, default=[ROOT / "gis", ROOT / "data"])
    args = parser.parse_args()
    for root in args.paths:
        for path in sorted(root.rglob("*")) if root.is_dir() else [root]:
            if path.suffix.lower() in {".gpkg", ".shp", ".geojson"}:
                vector_report(path)
            elif path.suffix.lower() in {".tif", ".tiff", ".vrt"}:
                raster_report(path)


if __name__ == "__main__":
    main()
