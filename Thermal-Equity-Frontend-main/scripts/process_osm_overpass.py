"""Convert a real Overpass JSON response with element centers to a point GeoPackage."""
from __future__ import annotations
import argparse
import json
from pathlib import Path
import geopandas as gpd
from shapely.geometry import Point


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if not args.input.is_file():
        raise SystemExit(f"WAITING_FOR_REAL_DATA: OSM response not found: {args.input}")
    document = json.loads(args.input.read_text(encoding="utf-8"))
    rows = []
    for element in document.get("elements", []):
        center = element.get("center", {})
        latitude = element.get("lat", center.get("lat"))
        longitude = element.get("lon", center.get("lon"))
        if latitude is None or longitude is None:
            continue
        rows.append({"osm_type": element.get("type"), "osm_id": element.get("id"), "name": element.get("tags", {}).get("name"), "leisure": element.get("tags", {}).get("leisure"), "geometry": Point(float(longitude), float(latitude))})
    if not rows:
        raise SystemExit("OSM response contains no mappable elements with coordinates.")
    output = gpd.GeoDataFrame(rows, geometry="geometry", crs="EPSG:4326")
    if output.geometry.isna().any() or (~output.geometry.is_valid).any():
        raise SystemExit("OSM point geometry validation failed.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    output.to_file(args.output, layer="osm_park_elements", driver="GPKG")
    print(f"WROTE {args.output}; features={len(output)}; source_elements={len(document.get('elements', []))}; geometry=element centers")


if __name__ == "__main__":
    main()
