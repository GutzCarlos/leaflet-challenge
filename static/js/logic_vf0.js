var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup(
        "<h3>" + feature.properties.title + "<br>" + "Magnitude: " + "</h3>" 
        + "<hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function Radio(attributeValue) {
		var scaleFactor = 10;
		var area = attributeValue * scaleFactor;
		return Math.sqrt(area/Math.PI)*2;			
    }
  
    function mColor(attributeValue){
        if (attributeValue >= 5){
            return "#993404";
        } else if (attributeValue >= 4 && attributeValue < 5) {
            return "#d95f0e";
        } else if (attributeValue >= 3 && attributeValue < 4) {
            return "#fe9929";
        } else if (attributeValue >= 2 && attributeValue < 3) {
            return "#fec44f";
        } else if (attributeValue >= 1.0 && attributeValue < 2) {
            return "#fee391";
        } else {
            return "#ffffd4";
        }
    }

    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        var mag = feature.properties.mag;
        return L.circleMarker(latlng, {
            radius: Radio(mag),
            fillColor: mColor(mag),
            color: "#FDFEFF",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
            });
        }
    });
  
    createMap(earthquakes);

}

function createMap(earthquakes) {


    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmdhdmlzaCIsImEiOiJjaXFheHJmc2YwMDdoaHNrcWM4Yjhsa2twIn0.8i1Xxwd1XifUU98dGE9nsQ';

    grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
    streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
    outdoors = L.tileLayer(mbUrl, {id: 'mapbox.outdoors', attribution: mbAttr}),
    satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr}),
    dark = L.tileLayer(mbUrl, {id: 'mapbox.dark', attribution: mbAttr}),
    light = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
    satellitestreets = L.tileLayer(mbUrl, {id: 'mapbox.streets-satellite', attribution: mbAttr});


    var baseMaps = {
    "Grayscale": grayscale,
    "Streets": streets,
    "Outdoors": outdoors,
    "Satellite": satellite,
    "Satellite Streets": satellitestreets,
    "Dark Map": dark,
    "Light Map": light
    };
    
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("map", {
      center: [0, 0],
      zoom: 2,
      layers: [dark, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var magnitudes = [">5","4-5","3-4", "2-3", "1-2", "0-1"];
      var colors = ["#993404", "#d95f0e", "#fe9929", "#fec44f", "#fee391", "#ffffd4"];
      var labels = ["Earthquake"+ "<br>"+ "Magnitud"];

      magnitudes.forEach(function(mag, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\">" + magnitudes[index] + "</li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    legend.addTo(myMap);  

}