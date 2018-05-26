/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';

class UMap extends LitElement {

  static get properties() {
    return {
      map: Object,
      minZoom: Number,
      maxZoom: Number,
      maxBounds: Array,
      mapWidth: Number,
      mapHeight: Number,
      objectFillColor: String,
      objectStrokeWidth: Number,
      __currentObject: Array
    };
  }

  _render(props) {
  }

  constructor() {
    super();

    this.map = null;
    this.minZoom = 4;
    this.maxZoom = 5;
    this.maxBounds = [[5, -180], [122, 100]];
    this.mapWidth = 6400;
    this.mapHeight = 4000;
    this.objectFillColor = '#ffc600';
    this.objectStrokeWidth = 2;
    this._objectHoverTimeOut = null;
    this.__currentObject = [];
  }

  _firstRendered() {
    super._firstRendered();
    this.init();
  }

  init() {
    if (!localStorage.access_token) {
      alert('Auth error');
      window.location.href = '/login';

    } else {
      this._createMap();
      this._setDefaultSettings();
      this._setMaxBounds();
      this._initializeTiles();
      this._setListeners();
      this._drawObjects();
    }
  }

  _createMap() {
    this.map = L.map('map', {});
  }

  _setDefaultSettings() {
    this.map.setView([70, 30], 5);
  }

  _setMaxBounds() {
    this.map.setMaxBounds(this.maxBounds);
  }

  _getBounds() {
    return new L.LatLngBounds(
      this.map.unproject([0, this.mapHeight], this.maxZoom),
      this.map.unproject([this.mapWidth, 0], this.maxZoom)
    );
  }

  _initializeTiles() {
    L.tileLayer('http://127.0.0.1:8081/src/components/app-level/u-map/images/tiles/{z}/{x}/{y}.jpg', {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      bounds: this._getBounds(),
      noWrap: true
    }).addTo(this.map);
  }

  _setListeners() {
    this.map.on('load', UMap._triggerResize());
    this.map.on('click', this.__getCoordinates.bind(this));
    this.map.on('keypress', this.__drawHelper.bind(this));
  }

  async _drawObjects() {
    return Promise.all[this._drawPaths(), this._drawCircles()];
  }

  async _drawPaths() {
    let response = await fetch('http://localhost:3000/api/objects/coordinates/paths', {
      headers: {
        'vk-access-token': localStorage.access_token
      }
    });

    if (response.ok) {
      const paths = await response.json();

      paths.forEach(item => {
        L.polygon(item.coordinates, {
          color: this.objectFillColor,
          weight: this.objectStrokeWidth
        })
          .on('mouseover', this._handleObjectMouseOver)
          .on('mouseout', this._handleObjectMouseOut)
          .on('click', this._handleObjectClick)
          .addTo(this.map);
      });
    } else {
      window.location.href = '/login';
    }
  }

  async _drawCircles() {
    let response = await fetch('http://localhost:3000/api/objects/coordinates/circles', {
      headers: {
        'vk-access-token': localStorage.access_token
      }
    });
    if (response.ok) {
      const circles = await response.json();

      circles.forEach(item => {
        L.circle(item.coordinates[0], {
          color: this.objectFillColor,
          weight: this.objectStrokeWidth,
          radius: item.coordinates[1]
        })
          .addTo(this.map);
      });
    } else {
      window.location.href = '/login';
    }
  }

  _handleObjectMouseOver(e) {
    this._objectHoverTimeOut = setTimeout(() => {
      let latLngs = e.target.getLatLngs()[0];

      UMap._getItemByLatLngs(latLngs)
        .then(function (data) {
          console.log(data);
        });
    }, 1000);
  }

  _handleObjectMouseOut() {
    clearTimeout(this._objectHoverTimeOut);
  }

  _handleObjectClick(e) {
    let latLngs = e.target.getLatLngs()[0];

    UMap._getItemByLatLngs(latLngs)
      .then(function (data) {
        console.log(data);
      });
  }

  __getCoordinates(e) {
    this.__currentObject.push([e.latlng.lat.toFixed(2), e.latlng.lng.toFixed(2)]);
  }

  __drawHelper(e) {
    if (e.originalEvent.code === 'Enter') {
      let path = '[[';
      this.__currentObject.forEach(dot => {
        path += `${dot.toString()}],[`;
      });
      path += ']';
      path = path.substring(0, path.length - 3);
      path += '],';

      console.log(path);
      this.__currentObject = [];
    }
  }

  static _triggerResize() {
    window.dispatchEvent(new Event('resize'));
  }

  static async _getItemByLatLngs(latLngs) {
    let coordinates = latLngs.map(item => {
      return [item.lat, item.lng];
    });

    let response = await fetch(`http://localhost:3000/api/objects?coordinates=${JSON.stringify(coordinates)}`, {
      headers: {
        'vk-access-token': localStorage.access_token
      }
    });

    return await response.json();
  }
}

window.customElements.define('u-map', UMap);
