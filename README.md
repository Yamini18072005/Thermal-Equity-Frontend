# Thermal Equity AI - Data & GIS

## Status

This repository is the reproducible data and GIS workflow for urban thermal equity analysis in Chennai, Tamil Nadu. The primary study area is the Greater Chennai Corporation (GCC), not the expanded Chennai Metropolitan Area (CMA). The CMA expansion map is retained as contextual reference only.

The project was inspected on 2026-08-21. The three GCC boundary GeoPackages are present and validated. The saved `.qgz` remains readable but contains zero saved map layers.

## Current inventory

- `data/raw/landsat/`: real Landsat 8 Collection 2 Level-2 inputs for 2026-06-06, path/row 142/051.
- `data/raw/lulc/`: real ESA WorldCover 2021 input tile.
- `data/raw/climate/open_meteo_humidity_2026-06-06.json`: real historical reanalysis humidity for 2026-06-06.
- `data/raw/air_quality/open_meteo_pm25_2026-06-06.json`: real CAMS/Open-Meteo PM2.5 model values for 2026-06-06.
- `data/raw/population/worldpop_region_stats.json`: real WorldPop 2020 GCC region total; `worldpop_ward_tasks/` contains exactly three successful ward responses (004, 062, and 169), while complete ward retrieval remains pending because the API stalled.
- `data/raw/CMAExpansionMap.pdf`: existing CMA reference document.
- `Thermal-Equity-AI-GIS.qgz`: existing QGIS project, preserved in place.
- `scripts/project_validation.py`: non-destructive project and metadata validator.
- `outputs/data_catalog.csv`: catalog with explicit pending/blocked statuses.
- `FINAL_OUTPUT_INVENTORY.md`: submission inventory of available, gated, and validated outputs.
- `QGIS_LAYER_LOAD_ORDER.md`: safe loading order for the validated layers because the saved QGIS project has no analytical layers.
- Processed real outputs are in `gis/raster/` and `outputs/tables/`; population and vulnerability inputs remain pending.
- Humidity and PM2.5 are coarse model/reanalysis representations mapped to the common 30 m grid, not station observations.

## Workflow

1. Export the official GCC Region Boundary from the active QGIS layer to `gis/boundaries/Region_Boundary.gpkg`, layer `Region_Boundary`. Validate geometry type, feature count, CRS, bounds, attributes, and validity.
2. Obtain and document authoritative GCC, ward, zone, population, Landsat, and optional Sentinel-2 sources in `outputs/data_catalog.csv` before processing.
3. Select one documented analysis period. Use Landsat Collection 2 Level-2 Surface Temperature for LST with QA cloud masking and product scale/offset metadata. Use Landsat Collection 2 surface reflectance with the official scale `0.0000275` and offset `-0.2` for NDVI and NDBI.
4. Reproject only when required by the analysis grid. Use an appropriate projected CRS for Chennai, preserve source resolution where possible, and document alignment, resampling, and NoData handling.
5. Produce ward, zone, and region summaries only after the corresponding validated boundaries exist.

## Thermal equity method

The planned index is a transparent weighted composite, calculated only from available validated variables:

The available exposure layers are LST, NDVI, NDBI, humidity, PM2.5, LULC, and OSM park locations. LST exposure uses documented 2nd-98th percentile normalization. Humidity and PM2.5 are retained as real coarse model inputs mapped to the common grid. The final equity formula remains gated until complete population and vulnerability inputs are available; no partial score is emitted.

Each component is normalized to [0, 1] within the documented study area, and larger values mean greater thermal vulnerability. Weights must be supplied and justified before index production; no results are claimed in this README.

## Reproducibility

Use the project root as the working directory and the selected project virtual environment. Install only the packages listed in `requirements.txt`. Run `python scripts/project_validation.py` before processing. All scripts must use paths relative to the project root and must stop with an explicit message when required external inputs are absent.

## Required external inputs

The current workspace contains validated GCC boundaries, Landsat, WorldCover, humidity, and PM2.5 model inputs, but no complete population or vulnerability indicators. Census/data.gov.in and WorldPop routes were attempted; WorldPop returned one GCC total and only three ward task results before the one-geometry-per-task API stalled. The official service URLs, acquisition dates/years, resolutions, CRS, and licenses are recorded in `data/data_sources.csv`.

## Limitations

LST is a land-surface, not near-surface air, temperature. Cloud contamination, emissivity assumptions, mixed pixels, temporal mismatch, boundary quality, demographic uncertainty, and spatial leakage in machine learning can affect inference. AI is optional and should only be used after a defensible analysis table exists.
