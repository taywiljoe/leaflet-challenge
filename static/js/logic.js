//URL for the GeoJSON data
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

// Create a leaflet map object
let myMap = L.map("map", {
    center: [37, 27],
    zoom: 3,
    // layers: [streets]
});

//Adding the tile layer
let purple = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Pull the earthquake JSON data with d3
d3.json(url).then(function (data) {

    // console.log(data, "its here")

    features = data.features;
    L.geoJson(data,{
        pointToLayer: function (feature,latlong){
            return L.circleMarker(latlong);
        },
        style: styleInfo
    }).addTo(myMap);
});

//define basemaps as the streetmap
let baseMaps = {
    "purple": purple
};

//define layergroups
let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

//define layergroups
let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};

//control layer
L.control.layers(baseMaps, overlays).addTo(myMap);

//styleInfo
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2])

    }
};