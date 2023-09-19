function markerSize(eq_magnitud) {
  //this function depending on the magnitude gives the size
    return (eq_magnitud * 29999);
  }

function colors(depth){
    //this function gaves different color values to depth
   
    let color="";
    //depending on the number it will give a different color
        if (depth < 10) {
            color= 'rgb(163, 246, 0)';
          }else if (depth < 30) {
            color= 'rgb(220, 244, 0)';
          }
          else if (depth < 50) {
            color= 'rgb(247, 219, 17)';
          } else if (depth < 70) {
            color= 'rgb(253, 183, 42)';
          }
          else if (depth < 90) {
            color= 'rgb(252, 163, 93)';
          }
          else {
            color= 'rgb(255, 95, 101)';
          }
    //it will return the color value
    return color;
  }   ; 
  

// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);

  });
  
  function createFeatures(earthquakeData) {
    //Setting up list for easier acces to the info
    earthquake_markers=[]
    magnitud=[]
    depth=[]
    title=[]
    date_list=[]
    location_list=[]
    
    for (let i = 0; i < earthquakeData.length; i++) {
      // Setting list of info,depth,title and date list 
      let date=0
      magnitud.push(earthquakeData[i].properties.mag);
      depth.push(earthquakeData[i].geometry.coordinates[2]);
      title.push(earthquakeData[i].properties.title);
      location_list.push(earthquakeData[i].properties.place)
      //converting to date
      var date2=earthquakeData[i].properties.time;
      var date_1=new Date(date2);
      var clean_date=date_1.toUTCString()
      date_list.push(clean_date)
      }

    for (let i = 0; i < earthquakeData.length; i++) {
      // Setting the circle marker
      earthquake_markers.push(L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]],{
        stroke: false,
        fillOpacity: 10,
        color: 'rgb(0, 0, 0)',
        fillColor: colors(depth[i]),
        radius: markerSize(magnitud[i])
        
      }).bindPopup(`<h3>${"Location: "+location_list[i]}</h3><hr><p>${"Magnitude: "+magnitud[i] }</p><hr><p>${"Depth: "+depth[i]}</p><hr><p>${date_list[i]}</p>`));

        };
    // Send our earthquakes layer to the createMap function/
    
    let circle_layer = L.layerGroup(earthquake_markers);
    createMap(circle_layer);
    console.log(earthquakeData)
  }
  
function createMap(circle_layer) {
  
// Define variables for our tile layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Only one base layer can be shown at a time.
let baseMaps = {
  Street: street,
  Topography: topo
};

// Overlays that can be toggled on or off
let overlayMaps = {
  Cities: circle_layer
};

// Create a map object, and set the default layers.
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
  layers: [street, circle_layer]
});

// Pass our map layers into our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = ["-10 - 10","10 - 30","30 - 50","50 - 70","70 - 90","90+"];;
    let colors = ['rgb(163, 246, 0)','rgb(220, 244, 0)','rgb(247, 219, 17)','rgb(253, 183, 42)','rgb(252, 163, 93)','rgb(255, 95, 101)'];
    let labels = [];

    // Add the minimum and maximum.
    let legendInfo = "<h1>Depth<br /></h1>" +
      "<div class=\"labels\">" +
        
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>"+"&nbsp"+ limits[index]+"<br>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
  
  }