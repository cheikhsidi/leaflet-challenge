// Load in geojson data
var data = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
    // var plates = 'C:/Users/cheikh_Moctar/Documents/UCF_Bootcamp/tectonicplatesGeoJSON/PB2002_plates.json'
    // function to change marker size
function markerSize(population) {
    return population * 6;
}

// Adding light map tile layer
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery Â© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

// Adding Satellite tile layer
var Satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery Â© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

// Adding Outdoor tile layer
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery Â© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

// Adding the BaseMap
var baseMaps = {
    "Satellite": Satellite,
    "GrayScate": lightmap,
    "Outdoors": outdoors
};

// Create Layers
var layers = {
    earthquakes: new L.LayerGroup(),
    FaultLines: new L.LayerGroup()
};

// Create the map
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 6,
    layers: [lightmap,
        layers.earthquakes,
        layers.FaultLines
    ]

});

// Creating the Overlay layers
var overlayMaps = {
    "Earthquakes": layers.earthquakes,
    "Fault Lines": layers.FaultLines
};

// return color based on value
function getValue(x) {
    return x > 5 ? "#E31A1C" :
        x > 4 ? "#FC4E2A" :
        x > 3 ? "#FD8D3C" :
        x > 2 ? "#FEB24C" :
        x > 1 ? "#FED976" :
        "#FFEDA0";

}

// # style function 
function style(feature) {
    return {
        fillOpacity: 0.8,
        color: getValue(feature.properties.mag),
        // color: "white",
        stroke: false,
        radius: markerSize(feature.properties.mag)
    };
}

// Adding the Plates Layer
d3.json('Leaflet-Step-2/plates.json', function(plates) {
    var FaultLine = L.geoJson(plates).setStyle({ fillColor: 'None', color: 'blue' });
    FaultLine.addTo(layers.FaultLines)
});

// Grab data with d3
d3.json(data, function(d) {
    var MetaData = d.metadata;
    var features = d.features;
    console.log(MetaData);
    console.log(features);
    console.log(features[0].properties.mag);
    // Looping through the dataset and creating circles
    features.forEach(feature => {
        var LatLong = feature.geometry.coordinates.slice(0, 2).reverse();
        L.circleMarker(LatLong, style(feature)).bindPopup("<h1> Magnitude :" + feature.properties.mag + "</h1> <hr> <h3> Place:" + feature.properties.place + "</h3>").addTo(layers.earthquakes);
    });
});


// Creating the Legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getValue(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// Adding the Legend
legend.addTo(myMap);
// Adding the Control
L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);