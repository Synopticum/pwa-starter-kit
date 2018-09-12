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
import {
  showObjectTooltip,
  hideObjectTooltip,
  showObjectInfoByCoordinates,
  hideObjectInfo,
  showObjectEditorByCoordinates,
  hideObjectEditor } from '../../../actions/map.js';

import map from '../../../reducers/map.js';
store.addReducers({
  map
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

      _object: { type: Object },
      _isTooltipVisible: { type: Boolean },
      _isEditorVisible: { type: Boolean },
      _isInfoVisible: { type: Boolean },
      _objectHoverTimeOut: { type: Number },

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
        <u-object-tooltip ?hidden="${!this._isTooltipVisible}">
          ${this._object ? this._object._id : ''}
        </u-object-tooltip>
        
        <u-object-info ?hidden="${!this._isInfoVisible}">${this._object ? this._object._id : ''}</u-object-info>      
        <u-object-editor ?hidden="${!this._isEditorVisible}"></u-object-editor>
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

    this._objectHoverTimeOut = null;

    this.__currentObject = [];
  }

  firstRendered() {
    this.init().catch(e => { throw new Error(e) });
  }

  _stateChanged(state) {
    this._object = state.map.object;
    this._isTooltipVisible = state.map.isTooltipVisible;
    this._isInfoVisible = state.map.isInfoVisible;
    this._isEditorVisible = state.map.isEditorVisible;
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
        'token': localStorage.token
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
        'token': localStorage.token
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
    if (!this._isEditorVisible && !this._isInfoVisible) {
      this._objectHoverTimeOut = setTimeout(() => {
        let coordinates = UMap._getObjectCoordinates(e.target);
        let position = UMap._calculateTooltipPosition(e.containerPoint.x, e.containerPoint.y);

        store.dispatch(showObjectTooltip(coordinates, position));
      }, 1000);
    }
  }

  _hideObjectTooltip() {
    clearTimeout(this._objectHoverTimeOut);

    if (this._isTooltipVisible) {
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

    if (this._isTooltipVisible) {
      store.dispatch(hideObjectTooltip());
    }

    if (e.originalEvent.altKey) {
      if (this._isInfoVisible) {
        store.dispatch(hideObjectInfo());
      }
      store.dispatch(showObjectEditorByCoordinates(coordinates))
    } else {
      if (this._isEditorVisible) {
        store.dispatch(hideObjectEditor());
      }
      store.dispatch(showObjectInfoByCoordinates(coordinates));
    }
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
