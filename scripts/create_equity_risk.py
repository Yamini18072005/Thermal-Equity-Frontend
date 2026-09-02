import rasterio
import numpy as np
from pathlib import Path

R=Path("gis/raster")

with rasterio.open(R/"lst.tif") as l, \
     rasterio.open(R/"pm25.tif") as p, \
     rasterio.open(R/"ndvi.tif") as n, \
     rasterio.open(R/"population_density.tif") as d, \
     rasterio.open(R/"vulnerability.tif") as v:

    lst=l.read(1).astype("float32")
    pm=p.read(1).astype("float32")
    ndvi=n.read(1).astype("float32")
    density=d.read(1).astype("float32")
    vuln=v.read(1).astype("float32")

    nodata=-9999
    valid=(lst!=nodata)&(pm!=nodata)&(ndvi!=nodata)&(density!=nodata)&(vuln!=nodata)

    def norm(a):
        x=a[valid]
        lo,hi=np.nanpercentile(x,[2,98])
        return np.clip((a-lo)/(hi-lo),0,1)

    equity=(
        0.35*norm(lst)+
        0.20*norm(pm)+
        0.15*norm(density)+
        0.20*(1-norm(ndvi))+
        0.10*(vuln/100)
    )*100

    equity[~valid]=nodata

    risk=np.full(equity.shape, nodata, dtype="int16")
    risk[valid & (equity<25)]=1
    risk[valid & (equity>=25) & (equity<50)]=2
    risk[valid & (equity>=50) & (equity<75)]=3
    risk[valid & (equity>=75)]=4

    profile=l.profile.copy()
    profile.update(dtype="float32",count=1,nodata=nodata)

    with rasterio.open(R/"thermal_equity_index.tif","w",**profile) as dst:
        dst.write(equity.astype("float32"),1)

    profile.update(dtype="int16")

    with rasterio.open(R/"risk_class.tif","w",**profile) as dst:
        dst.write(risk,1)

print("CREATED: gis\\raster\\thermal_equity_index.tif")
print("CREATED: gis\\raster\\risk_class.tif")
print("RISK CLASSES: 1=Low 2=Moderate 3=High 4=Very High")
