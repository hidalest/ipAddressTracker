"use strict";

// Elements
const inputIP = document.querySelector(".form--input");
const btn = document.querySelector(".form--btn");

const showIp = document.querySelector(".pannel--info-ip");
const showLocation = document.querySelector(".pannel--info-location");
const showTimezone = document.querySelector(".pannel--info-timezone");
const showISP = document.querySelector(".pannel--info-isp");

class App {
  map;
  constructor() {
    this._getGeolocation();
  }

  _getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._renderMap.bind(this),

        function () {
          console.log(`Couldnt get position`);
        }
      );
    }
  }

  _renderMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.map = L.map("map").setView(coords, 18);

    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(this.map);

    L.marker(coords)
      .addTo(this.map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  }
}

const app = new App();
