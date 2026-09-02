# Data and GIS Status

Updated 2026-08-21. The study area is Greater Chennai Corporation (GCC); the CMA PDF is context only.

## Available locally

- `gis/boundaries/Region_Boundary.gpkg`: 3 valid multipolygons, EPSG:32644.
- `gis/boundaries/Ward_Boundary.gpkg`: 200 valid multipolygons, EPSG:32644.
- `gis/boundaries/Zone_Boundary.gpkg`: 15 valid multipolygons, EPSG:32644.
- `data/raw/CMAExpansionMap.pdf`: reference PDF, not an analytical GIS input.
- `data/raw/landsat/`: real Landsat 8 Collection 2 Level-2 scene LC08_L2SP_142051_20260606_02_T1, acquired 2026-06-06, path/row 142/051, 30 m, EPSG:32644, 1.84% cloud cover.
- `data/raw/lulc/ESA_WorldCover_10m_2021_v200_N12E078_Map.tif`: real ESA WorldCover 2021 tile.
- `data/raw/climate/open_meteo_humidity_2026-06-06.json`: real historical reanalysis `relative_humidity_2m` values for 2026-06-06; 04:00 UTC selected for the Landsat acquisition.
- `data/raw/air_quality/open_meteo_pm25_2026-06-06.json`: real CAMS/Open-Meteo `pm2_5` values for 2026-06-06; 04:00 UTC selected for the Landsat acquisition.
- `data/raw/parks_overpass_probe.json` and `gis/vector/osm_parks.gpkg`: real OpenStreetMap Overpass park query and 462 validated element-center points.
- `gis/raster/lulc.tif`, `lulc_analysis.tif`, `ndvi.tif`, `ndbi.tif`, `lst.tif`, `humidity.tif`, `pm25.tif`, and `thermal_exposure.tif`: processed real rasters.
- `outputs/tables/thermal_exposure_by_ward.csv` and `raster_statistics.csv`: generated real-data summaries.

Boundary geometry and CRS are validated; official source export history, vintage, and license still require confirmation. The QGIS project has zero saved map layers; `QGIS_LAYER_LOAD_ORDER.md` provides the safe loading order.

## Missing real data

Population and vulnerability indicators are not complete. Census catalogue access did not yield a downloadable study-area table. The official WorldPop statistics API returned a real GCC region total and exactly three real ward task responses (004, 062, and 169), but its one-geometry-per-task batch stalled; incomplete ward coverage cannot produce a population raster. CPCB/OpenAQ access did not provide a usable unauthenticated observation file, so the documented CAMS/Open-Meteo PM2.5 alternative is used with model-source limitations. Humidity is available from the documented public Open-Meteo historical reanalysis alternative. Population and vulnerability remain waiting for complete source data in `data/data_sources.csv`.

All environmental values are from the documented public sources. No demographic values were generated because complete population coverage was unavailable.

## Commands

Run from the project root using `.venv\Scripts\python.exe`:

```powershell
.\.venv\Scripts\python.exe scripts/project_validation.py
.\.venv\Scripts\python.exe scripts/validate_data.py gis/boundaries/Region_Boundary.gpkg gis/boundaries/Ward_Boundary.gpkg gis/boundaries/Zone_Boundary.gpkg
\.venv\Scripts\python.exe scripts/process_lulc.py --input data/raw/lulc/ESA_WorldCover_10m_2021_v200_N12E078_Map.tif --boundary gis/boundaries/Region_Boundary.gpkg --output gis/raster/lulc.tif
\.venv\Scripts\python.exe scripts/process_lst.py --thermal data/raw/landsat/ST_B10.tif --qa-pixel data/raw/landsat/QA_PIXEL.tif --boundary gis/boundaries/Region_Boundary.gpkg --output gis/raster/lst.tif
\.venv\Scripts\python.exe scripts/process_ndvi.py --nir data/raw/landsat/SR_B5.tif --red data/raw/landsat/SR_B4.tif --output gis/raster/ndvi.tif --boundary gis/boundaries/Region_Boundary.gpkg
\.venv\Scripts\python.exe scripts/process_builtup.py --swir data/raw/landsat/SR_B6.tif --nir data/raw/landsat/SR_B5.tif --output gis/raster/ndbi.tif --boundary gis/boundaries/Region_Boundary.gpkg
\.venv\Scripts\python.exe scripts/align_raster.py --input gis/raster/lulc.tif --reference gis/raster/lst.tif --output gis/raster/lulc_analysis.tif --resampling nearest
\.venv\Scripts\python.exe scripts/process_humidity.py --input data/raw/climate/open_meteo_humidity_2026-06-06.json --reference gis/raster/lst.tif --output gis/raster/humidity.tif --hour 2026-06-06T04:00
\.venv\Scripts\python.exe scripts/process_pm25.py --input data/raw/air_quality/open_meteo_pm25_2026-06-06.json --reference gis/raster/lst.tif --output gis/raster/pm25.tif --hour 2026-06-06T04:00
\.venv\Scripts\python.exe scripts/thermal_exposure.py --raster gis/raster/lst.tif --boundaries gis/boundaries/Ward_Boundary.gpkg --key ward --output outputs/tables/thermal_exposure_by_ward.csv --output-raster gis/raster/thermal_exposure.tif
.\.venv\Scripts\python.exe scripts/thermal_equity_index.py --lst gis/raster/chennai_lst.tif --ndvi gis/raster/chennai_ndvi.tif --ndbi gis/raster/chennai_ndbi.tif --population POPULATION_ALIGNED_REAL.tif --output gis/raster/thermal_equity_index.tif
```

The final index command is intentionally blocked until complete population and vulnerability inputs exist. The current common analysis grid is the clipped Landsat grid: EPSG:32644, 30 m pixels, with the LST extent/transform; WorldCover is nearest-neighbour aligned to this grid in `lulc_analysis.tif`. Landsat Collection 2 reflectance bands use the official scale `0.0000275` and offset `-0.2` before NDVI/NDBI calculation. Humidity and PM2.5 are coarse model/reanalysis values represented on the 30 m grid, not station observations.

## Limitations

LST is land-surface temperature, not near-surface air temperature. Reanalysis humidity and station PM2.5 require documented temporal aggregation and spatial handling. Boundary joins, acquisition-period alignment, cloud masking, NoData, CRS, resolution, and licensing must be validated before analysis results are produced.
