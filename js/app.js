"use strict";

// Elements
const inputIP = document.querySelector(".form--input");
const btn = document.querySelector(".form--btn");
const form = document.querySelector(".form");

const pannelContainer = document.querySelector(".pannel");
const showIp = document.querySelector(".pannel--info-ip");
const showLocation = document.querySelector(".pannel--info-location");
const showTimezone = document.querySelector(".pannel--info-timezone");
const showISP = document.querySelector(".pannel--info-isp");

class App {
  _map;
  _marker;
  _ipInfo;
  _ipFromLocation;
  constructor() {
    this._getGeolocation();
    this._getInfo("");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const regexIp =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

      if (regexIp.test(inputIP.value))
        this._getInfo("ipAddress", inputIP.value);
      else this._getInfo("domain", inputIP.value);
    });
  }

  //FIXME delete after done
  getInfo() {
    console.log(this._ipInfo);
    console.log(this._ipInfo.isp);
    console.log(this._ipInfo.location.region);
  }

  _getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        this._renderMap(latitude, longitude); //working!
      });
    }
  }

  _renderMap(lat, lng) {
    const coords = [lat, lng];
    console.log(lat, lng);

    this._map = L.map("map").setView(coords, 15);

    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(this._map);

    this._marker = L.marker(coords)
      .addTo(this._map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  }

  _getJSON(url) {
    return fetch(url).then((response) => {
      if (!response.ok)
        throw new Error(`Response rejected, error ${response.status}`);
      return response.json();
    });
  }

  _getInfo(type, data) {
    return this._getJSON(
      `https://geo.ipify.org/api/v1?apiKey=at_NgGttAYTDFqu165ikDdSyZw5hNeP4&${type}=${data}`
    ).then((data) => {
      if (!data) throw new Error("No data found");
      else this._ipInfo = data;

      this._updateMapInfo(data);
      console.log(data);
    });
  }

  _updateMapInfo(info) {
    // Show information in the pannel
    this._renderInformation(this._ip, this._ipInfo);

    //Move the map to the desire location
    this._map.panTo(new L.LatLng(info.location.lat, info.location.lng), 15);

    //Create a marker on the cords of the IP address
    this._marker.setLatLng([info.location.lat, info.location.lng]).update(); // Updates your defined marker position
  }

  _renderInformation() {
    showIp.innerHTML = this._ipInfo.ip;
    showLocation.innerHTML = `${this._ipInfo.location.region}, ${this._ipInfo.location.country}`;
    showTimezone.innerHTML = this._ipInfo.location.timezone;
    showISP.innerHTML = this._ipInfo.isp;
  }
}

const app = new App();
