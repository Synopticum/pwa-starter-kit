/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { ENV } from '../../../../constants';
import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import { showObjectTooltip, hideObjectTooltip } from '../../../actions/map';
import { showObjectInfoByCoordinates } from '../../../actions/object';

import map from '../../../reducers/map';
import object from '../../../reducers/object';
store.addReducers({
  map,
  object
});

class UMap extends connect(store)(LitElement) {

  static get properties() {
    return {
      map: { type: Object },
      minZoom: { type: Number },
      maxZoom: { type: Number },
      maxBounds: { type: Array },
      mapWidth: { type: Number },
      mapHeight: { type: Number },
      objectFillColor: { type: String },
      objectStrokeWidth: { type: Number },

      activeObject: { type: Object },
      isFetching: { type: Boolean },
      isTooltipVisible: { type: Boolean },
      isObjectInfoVisible: { type: Boolean },
      objectHoverTimeOut: { type: Number },

      __currentObject: { type: Array }
    };
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      ${SharedStyles}
      
      <style>
        
        .info {
            width: 100vw;
            height: 100vh;
            z-index: 200;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .info::before {
          content: '';
          position: fixed;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          background: url('../../../../static/images/clouds65.jpg') no-repeat 50% 50%;
          transition: opacity ease .6s;
          will-change: opacity;
          opacity: .2;
          pointer-events: none;
          z-index: 10;
        }

        #map {
            cursor: move;
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background-color: #000000;
            pointer-events: all;
        }
        
        #map::before,
        #map::after {
            content: '';
            pointer-events: none;
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            z-index: 500;
        }
        
        /* shadow */
        #map::before {
            box-shadow: inset 0 0 200px rgba(0,0,0,0.9);
        }
        
        /* overlay */
        #map::after {
            opacity: .05;
            background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADAQMAAABs5if8AAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAA5JREFUCNdjeMDQwNAAAAZmAeFpNQSMAAAAAElFTkSuQmCC');
        }
        
        .leaflet-interactive {
            opacity: 0;
        }
        
        .leaflet-interactive:hover {
            opacity: 1;
        }
        
        .leaflet-control-container {
            z-index: 200;
        }
      </style>
      
      <div class="info">
        <u-object-tooltip ?hidden="${!this.isTooltipVisible}">
          ${this.activeObject ? this.activeObject._id : ''}
        </u-object-tooltip>
        
        <u-object-info ?hidden="${!this.isObjectInfoVisible}">${this.activeObject ? this.activeObject._id : ''}</u-object-info>
        <div style="position: fixed; left: 0; top: 0; z-index: 999; width: 100px; height: 100px; background: #fff; color: #000;">${this.isObjectInfoFetching ? 'fetching' : ''}</div>
      </div>
      
      <div id="map"></div>
    `;
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

    this.objectHoverTimeOut = null;

    this.__currentObject = [];
  }

  firstRendered() {
    this.init().catch(e => { throw new Error(e) });
  }

  _stateChanged(state) {
    this.activeObject = state.map.activeObject;
    this.isTooltipVisible = state.map.isTooltipVisible;
    this.isObjectInfoVisible = state.object.isVisible;
    this.isObjectInfoFetching = state.object.isFetching;
  }

  async init() {
    this._createMap();
    this._setDefaultSettings();
    this._setMaxBounds();
    this._initializeTiles();
    this._setListeners();
    await this._drawObjects();
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
    L.tileLayer(`${ENV.static}/static/images/tiles/{z}/{x}/{y}.jpg`, {
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
    let response = await fetch(`${ENV.api}/api/objects/coordinates/paths`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (response.ok) {
      const paths = await response.json();

      paths.forEach(item => {
        L.polygon(item.coordinates, {
          color: this.objectFillColor,
          weight: this.objectStrokeWidth
        })
          .on('mouseover', this._showObjectTooltip.bind(this))
          .on('mouseout', this._hideObjectTooltip.bind(this))
          .on('click', this._showObjectInfo.bind(this))
          .addTo(this.map);
      });
    } else {
      window.location.href = '/login';
    }
  }

  async _drawCircles() {
    let response = await fetch(`${ENV.api}/api/objects/coordinates/circles`, {
      headers: {
        'Token': localStorage.token
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
          .on('mouseover', this._showObjectTooltip.bind(this))
          .on('mouseout', this._hideObjectTooltip.bind(this))
          .on('click', this._showObjectInfo.bind(this))
          .addTo(this.map);
      });
    } else {
      window.location.href = '/login';
    }
  }

  _showObjectTooltip(e) {
    if (!this.isObjectInfoVisible) {
      this.objectHoverTimeOut = setTimeout(() => {
        let coordinates = UMap._getObjectCoordinates(e.target);
        let position = UMap._calculateTooltipPosition(e.containerPoint.x, e.containerPoint.y);

        store.dispatch(showObjectTooltip(coordinates, position));
      }, 1000);
    }
  }

  _hideObjectTooltip() {
    clearTimeout(this.objectHoverTimeOut);

    if (this.isTooltipVisible) {
      store.dispatch(hideObjectTooltip());
    }
  }

  static _calculateTooltipPosition(mouseX, mouseY) {
    let html = document.querySelector('html');
    let x;
    let y;
    let origin;

    html.clientWidth/2 < mouseX ? x = mouseX - 310 : x = mouseX;
    html.clientHeight/2 < mouseY ? y = mouseY - 160 : y = mouseY;

    // calculate transform-origin
    if (html.clientWidth/2 < mouseX && html.clientHeight/2 < mouseY) {
      origin = 'bottom right';
    } else if (html.clientWidth/2 < mouseX && html.clientHeight/2 >= mouseY) {
      origin = 'top right';
    } else if (html.clientWidth/2 >= mouseX && html.clientHeight/2 < mouseY) {
      origin = 'bottom left';
    } else if (html.clientWidth/2 >= mouseX && html.clientHeight/2 >= mouseY) {
      origin = 'top left';
    }

    return { x, y, origin };
  }

  _showObjectInfo(e) {
    let coordinates = UMap._getObjectCoordinates(e.target);

    if (this.isTooltipVisible) {
      store.dispatch(hideObjectTooltip());
    }

    store.dispatch(showObjectInfoByCoordinates(coordinates));
  }

  static _getObjectCoordinates(target) {
    let type = target.getRadius ? 'circle' : 'path';

    switch (type) {
      case 'circle':
        return [[target.getLatLng().lat, target.getLatLng().lng], target.getRadius()];

      case 'path':
        return target.getLatLngs()[0].map(item => [item.lat, item.lng]);
    }
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
}

window.customElements.define('u-map', UMap);
