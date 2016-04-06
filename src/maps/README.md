https://bost.ocks.org/mike/map/

# Includes country polygons
wget : http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_map_subunits.zip

unzip ne_10m_admin_0_map_subunits.zip -d ne_10m_admin_0_map_subunits

ogr2ogr  -f GeoJSON -where "ADM0_A3 IN ('GBR', 'IRL')" subunits.json ne_10m_admin_0_map_subunits.shp

ogr2ogr  -f GeoJSON -where "CONTINENT IN ('AFRICA')" africa.json ./ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp


ogr2ogr  -f GeoJSON world.json ./ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp



# names and locations of populated places.
wget : http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_populated_places.zip

unzip ne_10m_populated_places.zip -d ./ne_10m_populated_places

ogr2ogr  -f GeoJSON -where "ISO_A2 = 'GB' AND SCALERANK < 8" places.json ./ne_10m_populated_places/ne_10m_populated_places.shp

ogr2ogr  -f GeoJSON -where "TIMEZONE LIKE 'AFRICA%' AND SCALERANK < 8" africa-places.json ./ne_10m_populated_places/ne_10m_populated_places.shp

ogr2ogr  -f GeoJSON world-places.json ./ne_10m_populated_places/ne_10m_populated_places.shp

../../node_modules/.bin/topojson  -o africa-topo.json --id-property SU_A3 --properties name=NAME  -- africa.json africa-places.json
