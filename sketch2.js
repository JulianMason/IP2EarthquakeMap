

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Miller();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// Exclude Antartica
polygonSeries.exclude = ["AQ"];

// Make map load polygon (like country names) data from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.polygon.fillOpacity = 0.6;


// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = chart.colors.getIndex(0);

//Load external data
//chart.dataSource.url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var dataSource = chart.dataSource.url;

// Add image series
var imageSeries = chart.series.push(new am4maps.MapImageSeries());
imageSeries.mapImages.template.propertyFields.longitude = "latitude";
imageSeries.mapImages.template.propertyFields.latitude = "longitude";
imageSeries.mapImages.template.tooltipText = "{title}";
imageSeries.mapImages.template.propertyFields.url = "url";

var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
circle.radius = 3;
circle.propertyFields.fill = "color";

var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
circle2.radius = 3;
circle2.propertyFields.fill = "color";


circle2.events.on("inited", function(event){
  animateBullet(event.target);
})


function animateBullet(circle) {
    var animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
    animation.events.on("animationended", function(event){
      animateBullet(event.target.object);
    })
}

var colorSet = new am4core.ColorSet();

$.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(earthquake) {

    imageSeries.data = [ {

    "title": earthquake.features[8].properties.title,
    "latitude": earthquake.features[8].geometry.coordinates[0],
    "longitude": earthquake.features[8].geometry.coordinates[1],
    "color": colorSet.next()
    }];
   
     /** for (var i = 0; i < earthquake.features.length; i++) {
      imageSeries.data = [ {

      "title": earthquake.features[i].properties.title,
      "latitude": earthquake.features[i].geometry.coordinates[0],
      "longitude": earthquake.features[i].geometry.coordinates[1],
      "color": colorSet.next()
      }];
    }**/

})


