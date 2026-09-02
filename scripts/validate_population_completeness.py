"""Validate that a complete real one-row-per-ward population table exists."""
from __future__ import annotations
import argparse
from pathlib import Path
import pandas as pd
import geopandas as gpd


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--boundaries", type=Path, required=True)
    parser.add_argument("--population", type=Path, required=True)
    parser.add_argument("--key", default="ward")
    args = parser.parse_args()
    if not args.boundaries.is_file() or not args.population.is_file():
        raise SystemExit("POPULATION_VALIDATION: BLOCKED; complete real inputs are missing.")
    wards = gpd.read_file(args.boundaries, layer="Ward_Boundary")
    table = pd.read_csv(args.population)
    for name, data in (("boundaries", wards), ("population", table)):
        if args.key not in data.columns:
            raise SystemExit(f"POPULATION_VALIDATION: missing key {args.key} in {name}.")
    boundary_ids = set(wards[args.key].astype(str))
    population_ids = table[args.key].astype(str)
    duplicates = population_ids[population_ids.duplicated()].unique().tolist()
    missing = sorted(boundary_ids - set(population_ids))
    unexpected = sorted(set(population_ids) - boundary_ids)
    invalid = table["population"].isna().sum() + (pd.to_numeric(table["population"], errors="coerce") < 0).sum()
    if len(boundary_ids) != 200 or len(population_ids) != 200 or duplicates or missing or unexpected or invalid:
        raise SystemExit(f"POPULATION_VALIDATION: BLOCKED; expected=200 actual={len(population_ids)} missing={len(missing)} duplicates={len(duplicates)} unexpected={len(unexpected)} invalid={int(invalid)}")
    print("POPULATION_VALIDATION: PASS; 200 unique valid wards")


if __name__ == "__main__":
    main()
