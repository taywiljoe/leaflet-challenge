//URL for the GeoJSON data
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

// Create a leaflet map object
let myMap = L.map("map", {
    center: [37, 27],
    zoom: 3,
});

//Adding the tile layer
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//define basemaps as the streetmap
let baseMaps = {
    "Earthquakes": streets
};

//define layergroups
let earthquake_data = new L.LayerGroup();
// let tectonics = new L.LayerGroup();

//define layergroups
let overlays = {
    "Earthquakes": earthquake_data,
    // "Tectonic Plates": tectonics
};

//control layer
L.control.layers(baseMaps, overlays).addTo(myMap);

//Pull the earthquake JSON data with d3
d3.json(url).then(function (data) {

    //alter size of markers based on magnitude of earthquakes
    function chooseRadius(x) {
        if (x == 0) {
            return 1;
        }
        return x * 3
    };

    //define colors of markers
    function chooseColor(y) {
        if (y <= 10) return "red";
        else if (y > 10 & y <= 25) return "yellow";
        else if (y >25 & y <= 40) return "orange";  
        else if (y >40 & y <= 55) return "purple";
        else if (y >55 & y <= 70) return "blue";
        else return "green";
      };
      
 
    //styleInfo
    function styleInfo(feature) {
        return {
            color: chooseColor(feature.geometry.coordinates[2]),
            radius: chooseRadius(feature.properties.mag),
            fillColor: chooseColor(feature.geometry.coordinates[2])

        }
    };
    // console.log(data, "its here")

    //marker
    features = data.features;
    L.geoJson(data, {
        pointToLayer: function (feature, latlong) {
            return L.circleMarker(latlong);
        },
        style: styleInfo
    }).addTo(myMap);


    //creating the legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
    
    var div = L.DomUtil.create('div', 'info legend');
    grades = [10, 25, 40, 55, 70];
    // labels = []

    //loop for legend information
    for (let index = 0; index < grades.length; index++) {
        div.innerHTML +=
        '<i style="background: ' + chooseColor(grades[index] + 1) + '"></i>' +
        grades[index] + (grades[index + 1] ? '&ndash;' + grades[index + 1] + '<br>' : '+');
        
    }

    return div;
    };

    //add to map
    legend.addTo(myMap);
});