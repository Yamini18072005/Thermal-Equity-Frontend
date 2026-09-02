"""Join real ward population totals and rasterize density to the common grid."""
from __future__ import annotations
import argparse
from pathlib import Path
import geopandas as gpd
import pandas as pd
import numpy as np
import rasterio
from rasterio.features import rasterize


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--population", type=Path, required=True)
    parser.add_argument("--boundaries", type=Path, required=True)
    parser.add_argument("--reference", type=Path, required=True)
    parser.add_argument("--vector-output", type=Path, required=True)
    parser.add_argument("--raster-output", type=Path, required=True)
    args = parser.parse_args()
    for path in (args.population, args.boundaries, args.reference):
        if not path.is_file():
            raise SystemExit(f"REQUIRED INPUT MISSING: {path}")
    population = pd.read_csv(args.population)
    wards = gpd.read_file(args.boundaries, layer="Ward_Boundary")
    if "ward" not in population.columns or "ward" not in wards.columns:
        raise SystemExit("Both population and ward boundaries require a ward key.")
    population["ward"] = population["ward"].astype(str)
    wards["ward"] = wards["ward"].astype(str)
    if population["ward"].duplicated().any() or len(population) != len(wards):
        raise SystemExit("Population records are not a complete one-per-ward table.")
    if population["population"].isna().any() or (population["population"] < 0).any():
        raise SystemExit("Population values must be complete and non-negative.")
    wards = wards.merge(population, on="ward", how="left", validate="one_to_one")
    wards["area_m2"] = wards.to_crs(32644).geometry.area
    wards["population_density_per_km2"] = wards["population"] / (wards["area_m2"] / 1_000_000)
    wards["source_method"] = "WorldPop wpgppop 2020 API ward total; density from validated ward polygon area"
    args.vector_output.parent.mkdir(parents=True, exist_ok=True)
    wards.to_file(args.vector_output, layer="ward_population_2020", driver="GPKG")
    with rasterio.open(args.reference) as reference:
        shapes = ((geom, float(value)) for geom, value in zip(wards.to_crs(reference.crs).geometry, wards["population_density_per_km2"]))
        result = rasterize(shapes, out_shape=(reference.height, reference.width), transform=reference.transform, fill=-9999, dtype="float32")
        profile = reference.profile.copy()
        profile.update(driver="GTiff", dtype="float32", count=1, nodata=-9999, compress="deflate", units="persons per square kilometre", source_method="WorldPop 2020 ward totals divided by validated ward polygon area")
    with rasterio.open(args.raster_output, "w", **profile) as destination:
        destination.write(result, 1)
    valid = result[result != -9999]
    print(f"WROTE {args.vector_output} and {args.raster_output}; wards={len(wards)}; valid_pixels={len(valid)}; min={valid.min():.3f}; max={valid.max():.3f}")


if __name__ == "__main__":
    main()
