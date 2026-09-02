import geopandas as gpd
import pandas as pd
import rasterio
from rasterio.features import rasterize
from pathlib import Path
import numpy as np

b = gpd.read_file(r"gis\boundaries\Ward_Boundary.gpkg")
p = pd.read_csv(r"data\raw\population\ward_population_2011_joined.csv")

b["ward"] = b.iloc[:,1].astype(str).str.zfill(3)
p["ward"] = p["ward"].astype(str).str.zfill(3)

g = b.merge(p[["ward","population_2011"]], on="ward", how="left", validate="one_to_one")

assert len(g) == 200
assert g["population_2011"].notna().all()

gdf = gpd.read_file(r"gis\boundaries\Ward_Boundary.gpkg")
gdf["ward"] = gdf.iloc[:,1].astype(str).str.zfill(3)
gdf = gdf.merge(p[["ward","population_2011"]], on="ward", how="left", validate="one_to_one")

ref = r"gis\raster\lst.tif"

with rasterio.open(ref) as src:
    profile = src.profile.copy()
    transform = src.transform
    shape = (src.height, src.width)
    crs = src.crs

pop = rasterize(
    ((geom, float(val)) for geom,val in zip(gdf.geometry,gdf.population_2011)),
    out_shape=shape,
    transform=transform,
    fill=-9999,
    dtype="float32"
)

area = np.array([x.area for x in gdf.to_crs(crs).geometry])
density_values = gdf.population_2011.values / area

density = rasterize(
    ((geom, float(val)) for geom,val in zip(gdf.geometry,density_values)),
    out_shape=shape,
    transform=transform,
    fill=-9999,
    dtype="float32"
)

profile.update(count=1,dtype="float32",nodata=-9999,crs=crs)

Path("gis/raster").mkdir(exist_ok=True)

with rasterio.open(r"gis\raster\population.tif","w",**profile) as dst:
    dst.write(pop,1)

with rasterio.open(r"gis\raster\population_density.tif","w",**profile) as dst:
    dst.write(density,1)

print("WARD COUNT =",len(gdf))
print("TOTAL POPULATION =",int(gdf.population_2011.sum()))
print("CREATED: gis\\raster\\population.tif")
print("CREATED: gis\\raster\\population_density.tif")
