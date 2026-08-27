"""Validate and copy authoritative vector boundaries into GeoPackage files."""
from __future__ import annotations
import argparse
from pathlib import Path
import geopandas as gpd

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True, help="Exported authoritative vector boundary")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--layer", default="Region_Boundary")
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()
    if not args.input.is_file():
        raise SystemExit(f"REQUIRED INPUT MISSING: {args.input}. Export the active QGIS layer from QGIS first.")
    if args.output.exists() and not args.overwrite:
        raise SystemExit(f"REFUSING TO OVERWRITE: {args.output}; use --overwrite explicitly.")
    data = gpd.read_file(args.input)
    if data.empty or data.crs is None or data.geometry.isna().any() or (~data.geometry.is_valid).any():
        raise SystemExit("Boundary failed validation: it must be non-empty, have a CRS, and contain valid non-null geometry.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    data.to_file(args.output, layer=args.layer, driver="GPKG")
    print(f"WROTE {args.output} layer={args.layer} features={len(data)} CRS={data.crs} geometry={data.geom_type.unique().tolist()} bounds={tuple(data.total_bounds)}")


if __name__ == "__main__":
    main()
