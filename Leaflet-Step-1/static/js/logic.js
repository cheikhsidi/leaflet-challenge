// Load in geojson data
var data = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// function to change marker size
function markerSize(population) {
    return population * 6;
}

// Adding tile layer
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery Â© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

// Create the map
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 6,
    layers: lightmap

});


// return color based on value
function getValue(x) {
    return x > 5 ? "#BD0026" :
        x > 4 ? "#E31A1C" :
        x > 3 ? "#FC4E2A" :
        x > 2 ? "#FD8D3C" :
        x > 1 ? "#FEB24C" :
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

// Grab data with d3
d3.json(data, function(d) {
    console.log(d)
    var features = d.features
    console.log(features[0].properties.mag)

    // Looping through the dataset and creating circles
    features.forEach(feature => {
        var LatLong = feature.geometry.coordinates.slice(0, 2).reverse();
        L.circleMarker(LatLong, style(feature)).bindPopup("<h1>" + feature.properties.mag + "</h1> <hr> <h3>Time: </h3>").addTo(myMap);
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

legend.addTo(myMap);