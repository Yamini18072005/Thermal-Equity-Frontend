"""Validate the Thermal Equity AI project without creating or modifying data."""

from __future__ import annotations

import argparse
import importlib.util
import json
import py_compile
import sys
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUIRED_DIRECTORIES = (
    "data/raw",
    "data/processed",
    "data/final",
    "gis/boundaries",
    "gis/raster",
    "gis/vector",
    "notebooks",
    "outputs",
    "outputs/maps",
    "outputs/tables",
    "scripts",
)
REQUIRED_FILES = (
    "Thermal-Equity-AI-GIS.qgz",
    "Thermal-Equity-AI/README.md",
    "data/raw/CMAExpansionMap.pdf",
    "outputs/data_catalog.csv",
    "data/data_sources.csv",
    "FINAL_OUTPUT_INVENTORY.md",
    "QGIS_LAYER_LOAD_ORDER.md",
)
EXPECTED_MODULES = ("numpy", "pandas", "geopandas", "rasterio", "shapely", "pyproj", "sklearn", "jupyter")
EXPECTED_SCRIPTS = (
    "validate_data.py",
    "prepare_boundaries.py",
    "process_lst.py",
    "process_ndvi.py",
    "process_builtup.py",
    "process_lulc.py",
    "align_raster.py",
    "export_raster_products.py",
    "process_osm_overpass.py",
    "process_population_raster.py",
    "acquire_worldpop_wards.py",
    "build_population_outputs.py",
    "validate_population_completeness.py",
    "create_population_vulnerability.py",
    "process_humidity.py",
    "process_pm25.py",
    "prepare_population.py",
    "thermal_exposure.py",
    "thermal_equity_index.py",
    "train_thermal_model.py",
    "project_validation.py",
)
EXPECTED_NOTEBOOKS = tuple(f"{number:02d}_{name}.ipynb" for number, name in (
    (1, "data_inventory"), (2, "boundary_preparation"), (3, "lst_processing"),
    (4, "ndvi_processing"), (5, "builtup_processing"), (6, "population_vulnerability"),
    (7, "thermal_exposure"), (8, "thermal_equity"), (9, "ai_model"),
))


def report(status: str, message: str) -> None:
    print(f"{status}: {message}")


def check_paths() -> None:
    for relative_path in REQUIRED_DIRECTORIES:
        path = ROOT / relative_path
        report("PASS" if path.is_dir() else "FAIL", f"directory {relative_path}")
    for relative_path in REQUIRED_FILES:
        path = ROOT / relative_path
        report("PASS" if path.is_file() else "WARNING", f"file {relative_path}")


def check_imports() -> None:
    for module_name in EXPECTED_MODULES:
        available = importlib.util.find_spec(module_name) is not None
        report("PASS" if available else "FAIL", f"Python import {module_name}")


def check_code_assets() -> None:
    for filename in EXPECTED_SCRIPTS:
        path = ROOT / "scripts" / filename
        if not path.is_file():
            report("FAIL", f"script {filename}")
            continue
        try:
            py_compile.compile(str(path), doraise=True)
            report("PASS", f"script compiles {filename}")
        except py_compile.PyCompileError as error:
            report("FAIL", f"script does not compile {filename}: {error.msg}")
    for filename in EXPECTED_NOTEBOOKS:
        path = ROOT / "notebooks" / filename
        if not path.is_file():
            report("FAIL", f"notebook {filename}")
            continue
        try:
            document = json.loads(path.read_text(encoding="utf-8"))
            valid_cells = all(
                cell.get("metadata", {}).get("language") in {"markdown", "python"}
                or cell.get("cell_type") in {"markdown", "code"}
                for cell in document.get("cells", [])
            )
            report("PASS" if valid_cells else "FAIL", f"notebook JSON and cell languages {filename}")
        except (OSError, json.JSONDecodeError) as error:
            report("FAIL", f"notebook could not be read {filename}: {error}")


def check_data_assets() -> None:
    vector_paths = [path for root in (ROOT / "gis", ROOT / "data") for path in root.rglob("*") if path.suffix.lower() in {".gpkg", ".shp", ".geojson"}]
    raster_paths = [path for root in (ROOT / "gis", ROOT / "data") for path in root.rglob("*") if path.suffix.lower() in {".tif", ".tiff", ".vrt"}]
    report("WARNING" if not vector_paths else "PASS", f"vector dataset inspection ({len(vector_paths)} found)")
    report("WARNING" if not raster_paths else "PASS", f"raster dataset inspection ({len(raster_paths)} found)")
    for path in vector_paths:
        try:
            import geopandas as gpd
            layer = gpd.read_file(path)
            invalid = int((~layer.geometry.is_valid).sum())
            report("PASS" if layer.crs is not None and invalid == 0 else "FAIL", f"vector {path.relative_to(ROOT)} CRS/validity")
        except Exception as error:
            report("FAIL", f"vector {path.relative_to(ROOT)} could not be read: {error}")
    for path in raster_paths:
        try:
            import rasterio
            with rasterio.open(path) as source:
                valid = source.crs is not None and source.nodata is not None
                report("PASS" if valid else "WARNING", f"raster {path.relative_to(ROOT)} CRS/NoData")
        except Exception as error:
            report("FAIL", f"raster {path.relative_to(ROOT)} could not be read: {error}")


def check_qgis_project() -> None:
    project_path = ROOT / "Thermal-Equity-AI-GIS.qgz"
    if not project_path.is_file():
        return
    try:
        with zipfile.ZipFile(project_path) as archive:
            qgs_names = [name for name in archive.namelist() if name.endswith(".qgs")]
            if not qgs_names:
                report("FAIL", "QGIS project has no embedded .qgs document")
                return
            text = archive.read(qgs_names[0]).decode("utf-8", errors="replace")
            layer_count = text.count("<maplayer")
            report("PASS", f"QGIS project container is readable ({layer_count} saved map layers)")
            if "Region_Boundary" in text:
                report("PASS", "saved QGIS project references Region_Boundary")
            else:
                report("WARNING", "saved QGIS project does not reference Region_Boundary")
    except (OSError, zipfile.BadZipFile) as error:
        report("FAIL", f"QGIS project could not be inspected: {error}")


def check_catalog() -> None:
    catalog_path = ROOT / "outputs/data_catalog.csv"
    if not catalog_path.is_file():
        return
    required_columns = {
        "dataset",
        "category",
        "source",
        "official_url",
        "date_accessed",
        "data_year",
        "format",
        "CRS",
        "resolution",
        "coverage",
        "description",
        "license",
        "processing_status",
        "notes",
    }
    try:
        import csv

        with catalog_path.open(newline="", encoding="utf-8") as handle:
            columns = set(next(csv.reader(handle), []))
        missing = required_columns - columns
        report("PASS" if not missing else "FAIL", "data catalog columns" + (f" missing {sorted(missing)}" if missing else ""))
    except (OSError, StopIteration) as error:
        report("FAIL", f"data catalog could not be read: {error}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="Reserved for a future machine-readable report")
    parser.parse_args()
    print(f"Project root: {ROOT}")
    check_paths()
    check_imports()
    check_code_assets()
    check_data_assets()
    check_qgis_project()
    check_catalog()
    return 0


if __name__ == "__main__":
    sys.exit(main())