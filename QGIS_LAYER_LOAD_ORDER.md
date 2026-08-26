# QGIS Layer Loading Order

The existing `Thermal-Equity-AI-GIS.qgz` is preserved unchanged because QGIS automation is not available on PATH. It contains zero saved analytical layers. Load the following validated layers manually in this order when QGIS is available, then save a new project as `Thermal-Equity-AI-GIS-FINAL.qgz`.

1. `gis/raster/lulc_analysis.tif`
2. `gis/raster/lst.tif`
3. `gis/raster/ndvi.tif`
4. `gis/raster/ndbi.tif`
5. `gis/raster/humidity.tif`
6. `gis/raster/pm25.tif`
7. `gis/raster/thermal_exposure.tif`
8. `gis/vector/gcc_processed_boundaries.gpkg`, layer `Region_Boundary`
9. `gis/vector/gcc_processed_boundaries.gpkg`, layer `Zone_Boundary`
10. `gis/vector/gcc_processed_boundaries.gpkg`, layer `Ward_Boundary`
11. `gis/vector/osm_parks.gpkg`, layer `osm_park_elements`

Population, vulnerability, and final equity layers are not listed because they do not exist. OSM park features are points representing source element centers, not polygon footprints.
