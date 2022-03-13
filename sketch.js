// Loading Weather Data from Open Weather Map
// https://www.youtube.com/watch?v=ecT42O6I_WI&list=PLRqwX-V7Uu6a-SQiI4RtIwuOrLJGnel0r&index=6&t=0s

// We're going to store the temperature
let temperature = 0;
// We're going to store text about the weather
let weather = "";

let wind = "";
let id = "";
let name = "";

let json = null;

// let url =
//   "https://api.openweathermap.org/data/2.5/weather?lat=52.785805&lon=6.897585&appid=e812164ca05ed9e0344b89ebe273c141";

// function preload() {
//   // The URL for the JSON data (replace "imperial" with "metric" for celsius)
//   // let url = "https://api.openweathermap.org/data/2.5/weather?q=New%20York&units=imperial&APPID=e812164ca05ed9e0344b89ebe273c141";

//   json = loadJSON(url);
// }

const u = 10;
const v = 5;

const bounds = {
  left: -11.133956,
  bottom: 36.146738,
  top: 56.053629,
  right: 32.74427,
};

const ustep = (bounds.right - bounds.left) / u;
const vstep = (bounds.top - bounds.bottom) / v;

let data = [];

let i = 0;
let j = 0;

let done = false;
let projection;
let countries;
let country;

function preload() {
  geodata = loadJSON("world.geojson");
}

function setup() {
  createCanvas(800, 600);

  const testvec = createVector(1, 0);
  console.log("heading", testvec.heading());

  projection = d3
    .geoMercator()
    .center([8.30801, 47.04554])
    .translate([width / 2, height / 2])
    .scale(8000);

  countries = geodata.features;
  console.log(countries[0]);

  let selection = geodata.features.filter(function (d) {
    return d.properties.CNTR_ID == "CH";
  });

  country = selection[0];

  console.log(country);

  // let u = 60;
  // let v = 30;
  // for (let i = 0; i < u; i++) {
  //   for (let j = 0; j < v; j++) {
  //     let lon = map(i, 0, u, bounds.left, bounds.right);
  //     let lat = map(j, 0, v, bounds.bottom, bounds.top);
  //     setTimeout(function () {
  //       fetchData(lat, lon);
  //     }, (i + j) * 2000);
  //   }
  // }

  console.log(json);
  frameRate(1);
}

function draw() {
  // draw polygons

  let coordinates = country.geometry.coordinates;
  let type = country.geometry.type;

  for (let j = 0; j < coordinates.length; j++) {
    let coordinates2 = [];
    if (type == "Polygon") {
      coordinates2 = coordinates[j];
    } else if (type == "MultiPolygon") {
      coordinates2 = coordinates[j][0];
    }

    beginShape();
    for (let k = 0; k < coordinates2.length; k++) {
      let xy = projection(coordinates2[k]);
      vertex(xy[0], xy[1]);
    }
    endShape();
  }

  // if (!done) {
  //   let lon = map(i, 0, 10, bounds.left, bounds.right);
  //   let lat = map(j, 0, 5, bounds.bottom, bounds.top);
  //   fetchData(lat, lon);
  //   i++;
  //   if (i > 10) {
  //     i = 0;
  //     j++;
  //   }
  //   if (j > 5) {
  //     done = true;
  //   }
  // }
  // if (!json) {
  //   background(255, 0, 0);
  //   return;
  // }
  // background(250);
  // for (let i = 0; i < data.length; i++) {
  //   let wind = data[i].wind;
  //   let lon = data[i].coord.lon;
  //   let lat = data[i].coord.lat;
  //   let x = map(lon, bounds.left, bounds.right, 0, width);
  //   let y = map(lat, bounds.bottom, bounds.top, height, 0);
  //   let v = createVector(0.5 * wind.speed, 0);
  //   v.setHeading(radians(wind.deg - 90 + 180));
  //   fill(0);
  //   noStroke();
  //   ellipse(x, y, 2, 2);
  //   stroke(0);
  //   line(x, y, x + v.x, y + v.y);
  //   if (i % 59 == 0) {
  //     text(data[i].name + " " + wind.deg, x, y);
  //   }
  // }
}

/*
{
  "coord":{
    "lon":-74.01,
    "lat":40.71
  },
  "sys":{
    "message":0.2012,
    "country":"US",
    "sunrise":1406540974,
    "sunset":1406592927
  },
  "weather":[
    {
      "id":801,
      "main":"Clouds",
      "description":"few clouds",
      "icon":"02d"
    }
  ],
  "base":"cmc stations",
  "main":{
    "temp":73.45,
    "humidity":83,
    "pressure":999,
    "temp_min":70,
    "temp_max":75.99
  },
  "wind":{
    "speed":4.45,
    "gust":3.6,
    "deg":259
  },
  "rain":{
    "3h":0
  },
  "clouds":{
    "all":24
  },
  "dt":1406559145,
  "id":5128581,
  "name":"New York",
  "cod":200
}
*/

function fetchData(lat, lon) {
  console.log("fetchData", lat, lon);
  // let lat = 52.785805;
  // let lon = 5.897585;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}5&lon=${lon}&appid=2f61dd5066bd4f61e9bf71d4a8f2bf89`;
  d3.json(url).then(function (response) {
    console.log("response", response);
    json = response;
    console.log("wind", json.wind.deg);
    data.push(json);

    //   redraw();
  });
}
