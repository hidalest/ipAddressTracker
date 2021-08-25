"use strict";

// Elements
const inputIP = document.querySelector(".form--input");
const btn = document.querySelector(".form--btn");
const form = document.querySelector(".form");
const spinner = document.querySelector(".spinner");

const pannelContainer = document.querySelector(".pannel");
const showIp = document.querySelector(".pannel--info-ip");
const showLocation = document.querySelector(".pannel--info-location");
const showTimezone = document.querySelector(".pannel--info-timezone");
const showISP = document.querySelector(".pannel--info-isp");

class App {
  _map;
  _marker;
  _ipInfo;
  constructor() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this._getInfo("");
          const { latitude, longitude } = position.coords;

          this._renderMap(latitude, longitude); //working!
        },
        function () {
          swal(
            "Couln't get your location",
            "Please check your privacy settings! We need your location services in order to work :)",
            "error"
          );
        }
      );
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const regexIp =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

      if (regexIp.test(inputIP.value))
        this._getInfo("ipAddress", inputIP.value);
      else this._getInfo("domain", inputIP.value);
    });
  }

  _renderMap(lat, lng) {
    const coords = [lat, lng];

    this._map = L.map("map").setView(coords, 20);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    this._marker = L.marker(coords).addTo(this._map);
  }

  _getJSON(url) {
    inputIP.value = "";
    spinner.classList.remove("hide");
    return fetch(url).then((response) => {
      spinner.classList.add("hide");
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      return response.json();
    });
  }

  _getInfo(type, data) {
    return this._getJSON(
      `https://geo.ipify.org/api/v1?apiKey=at_NgGttAYTDFqu165ikDdSyZw5hNeP4&${type}=${data}`
    )
      .then((data) => {
        if (!data) {
          throw new Error("No data found");
        } else this._ipInfo = data;

        this._updateMapInfo(data);
      })
      .catch((err) => {
        swal(
          `Information entered is not valid, error(${err.message})`,
          "Please enter a valid IP adress or Domain",
          "warning"
        );
      });
  }

  _updateMapInfo(info) {
    // Show information in the pannel
    this._renderInformation(this._ip, this._ipInfo);

    //Move the map to the desire location
    this._map.panTo(new L.LatLng(info.location.lat, info.location.lng), 20);

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
