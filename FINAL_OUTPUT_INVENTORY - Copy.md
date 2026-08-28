# Final Data + GIS Output Inventory

Updated 2026-08-21. Study area: Greater Chennai Corporation (GCC). Common analytical grid: EPSG:32644, 30 m, 716 x 1412, NoData -9999. Final state: SOURCE-BLOCKED for population-derived products.

## Available real source data

- `gis/boundaries/Region_Boundary.gpkg`: 3 valid GCC region multipolygons.
- `gis/boundaries/Ward_Boundary.gpkg`: 200 valid GCC ward multipolygons.
- `gis/boundaries/Zone_Boundary.gpkg`: 15 valid GCC zone multipolygons.
- `data/raw/landsat/`: Landsat 8 Collection 2 Level-2 scene LC08_L2SP_142051_20260606_02_T1, 2026-06-06, WRS 142/051, 30 m, EPSG:32644.
- `data/raw/lulc/ESA_WorldCover_10m_2021_v200_N12E078_Map.tif`: ESA WorldCover 2021 v200, 10 m, EPSG:4326.
- `data/raw/climate/open_meteo_humidity_2026-06-06.json`: real historical reanalysis relative_humidity_2m, 04:00 UTC.
- `data/raw/air_quality/open_meteo_pm25_2026-06-06.json`: real CAMS/Open-Meteo pm2_5, 04:00 UTC.
- `data/raw/parks_overpass_probe.json`: real Overpass response; retained as raw provenance.
- `data/raw/population/worldpop_region_stats.json`: real WorldPop 2020 GCC region total, 6,870,042.
- `data/raw/population/worldpop_ward_tasks/`: exactly three successful real ward task responses for wards 004, 062, and 169 of 200; incomplete coverage is retained as provenance only.

## Processed GIS outputs

| Output | Status | Validation |
|---|---|---|
| `gis/raster/lst.tif` | PROCESSED | Common grid; 479,439 valid pixels; 30.43 to 60.83 C |
| `gis/raster/ndvi.tif` | PROCESSED | Common grid; bounded -1 to 1 |
| `gis/raster/ndbi.tif` | PROCESSED | Common grid; bounded -1 to 1 |
| `gis/raster/lulc.tif` | PROCESSED | Real WorldCover clip; source grid EPSG:4326 |
| `gis/raster/lulc_analysis.tif` | PROCESSED | Common grid; nearest-neighbour categorical alignment |
| `gis/raster/humidity.tif` | PROCESSED | Common grid; real coarse reanalysis representation; 43 to 47 percent |
| `gis/raster/pm25.tif` | PROCESSED | Common grid; real coarse CAMS representation; 6.4 to 7.1 micrograms per cubic metre |
| `gis/raster/thermal_exposure.tif` | PROCESSED | Common grid; documented 2nd-98th percentile LST normalization to 0-100 |
| `gis/vector/gcc_processed_boundaries.gpkg` | PROCESSED | 3 layers; valid geometries; EPSG:32644 |
| `gis/vector/osm_parks.gpkg` | PROCESSED | 462 valid point features; EPSG:4326; element centers |

The humidity and PM2.5 source data are coarse model/reanalysis representations mapped to the common grid, not station observations.

## Tables and maps

- `outputs/tables/raster_statistics.csv`
- `outputs/tables/thermal_exposure_by_ward.csv`
- `outputs/maps/lst.png`
- `outputs/maps/ndvi.png`
- `outputs/maps/ndbi.png`
- `outputs/maps/lulc.png`
- `outputs/maps/lulc_analysis.png`
- `outputs/maps/humidity.png`
- `outputs/maps/pm25.png`
- `outputs/maps/thermal_exposure.png`

## Gated outputs

These files were intentionally not generated because complete population and vulnerability inputs are unavailable:

- `gis/raster/population.tif`
- `gis/raster/vulnerability.tif`
- `gis/raster/thermal_equity_index.tif`
- final equity ward table
- AI-ready feature table
- risk-class and high-risk maps

## Provenance and validation

- Full dataset records: `data/data_sources.csv`.
- Ingestion and blocker configuration: `data/ingestion_config.json`.
- Status and reproducibility notes: `DATA_STATUS.md`.
- All produced analysis rasters use the exact common grid unless explicitly identified as the original WorldCover source clip.
- All retained source files are real public data or source responses with provenance recorded.
