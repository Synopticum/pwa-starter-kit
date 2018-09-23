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
import { getObjectInfoByCoordinates } from '../../../actions/object';
import { getDotInfoById } from '../../../actions/dot';

import map from '../../../reducers/map';
import object from '../../../reducers/object';
import dot from '../../../reducers/dot';
import { putDot } from '../../../actions/dot';
store.addReducers({
  map,
  object,
  dot
});

const headers = {
  'Content-Type': 'application/json',
  'Token': localStorage.token
};

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
      isTooltipVisible: { type: Boolean },
      isObjectInfoVisible: { type: Boolean },
      objectHoverTimeOut: { type: Number },


      tempDotRef: { type: Object }, // need for storing temporary data about where a marker will be added
      activeDot: { type: Object },
      isDotInfoVisible: { type: Boolean },
      isDotInfoFetching: { type: Boolean },

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
        
        path.leaflet-interactive {
            cursor: pointer;
            opacity: 0;
        }
        
        path.leaflet-interactive:hover {
            opacity: 1;
        }
        
        .leaflet-marker-icon {
            opacity: 1;
            transition: opacity .3s;
        }
        
        .leaflet-marker-icon--is-updating {
            opacity: .5;
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
        
        <u-dot-info ?hidden="${!this.isDotInfoVisible}">${this.activeDot ? this.activeDot.id : ''}</u-dot-info>
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
    this.isTooltipFetching = state.map.isTooltipFetching;

    this.isObjectInfoVisible = state.object.isVisible;

    this.isDotInfoVisible = state.dot.isVisible;
    this.isDotInfoFetching = state.dot.isFetching;
    this.isDotUpdating = state.dot.isUpdating;

    // show that object info is fetching (on object hover)
    if (this.map && this.map._container) {
      (this.isTooltipFetching || this.isObjectInfoFetching) ? this.showCursorSpinner(true) : this.showCursorSpinner(false);
    }

    if (this.tempDotRef && state.dot.isUpdating === false) {
      this._enableDot();
    }

  }

  async init() {
    this._createMap();
    this._setDefaultSettings();
    this._setMaxBounds();
    this._initializeTiles();
    this._setListeners();
    await this._drawObjects();
    await this._drawDots();
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
    this.map.on('click', this._handleClick.bind(this));
    this.map.on('keypress', this.__drawHelper.bind(this));
  }

  async _drawObjects() {
    return Promise.all[this._drawPaths(), this._drawCircles()];
  }

  async _drawPaths() {
    try {
      let response = await fetch(`${ENV.api}/api/objects/coordinates/paths`, { headers });
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
    } catch (e) {
      console.error(`Unable to draw paths`, e);
    }
  }

  async _drawCircles() {
    try {
      let response = await fetch(`${ENV.api}/api/objects/coordinates/circles`, { headers });
      let circles = await response.json();

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
    } catch (e) {
      console.error(`Unable to draw circles`, e);
    }
  }

  async _drawDots() {
    try {
      let response = await fetch(`${ENV.api}/api/dots`, { headers });
      let dots = await response.json();

      let markers = L.layerGroup(dots.map(dot => L.marker(dot.coordinates, { id: dot.id }).on('click', this._showDotInfo.bind(this))));
      let overlayMaps = {
        "Markers": markers
      };

      markers.addTo(this.map);
      L.control.layers(null, overlayMaps).addTo(this.map);
    } catch (e) {
      console.error(`Unable to draw dots`, e);
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
    if (!e.originalEvent.altKey) {
      let coordinates = UMap._getObjectCoordinates(e.target);

      if (this.isTooltipVisible) {
        store.dispatch(hideObjectTooltip());
      }

      store.dispatch(getObjectInfoByCoordinates(coordinates));
    }
  }

  _showDotInfo(e) {
    if (!e.originalEvent.altKey) {
      let dotId = e.target.options.id;
      store.dispatch(getDotInfoById(dotId));
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

  _handleClick(e) {
    if (e.originalEvent.altKey && !this.isDotUpdating) {
      this._addDot([e.latlng.lat, e.latlng.lng]);
    }
  }

  _addDot(coordinates) {
    if (confirm('Do you want to add a marker?')) {
      let dot = {
        type: 'global',
        id: uuidv4(),
        coordinates
      }

      this.tempDotRef = new L.marker(coordinates, { id: dot.id }).on('click', this._showDotInfo.bind(this)).addTo(this.map);
      this.tempDotRef._icon.classList.add('leaflet-marker-icon--is-updating');
      store.dispatch(putDot(dot));
    }
  }

  _enableDot() {
    this.tempDotRef._icon.classList.remove('leaflet-marker-icon--is-updating');
    this.tempDotRef = null;
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

  showCursorSpinner(value) {
    // let leafletStyles = document.styleSheets[1];
    // if (value) {
    //   this.map._container.style.cursor = 'wait';
    //   if (leafletStyles) leafletStyles.insertRule('.leaflet-interactive { cursor: wait !important }', 0);
    // } else {
    //   this.map._container.style.cursor = 'default';
    //   if (leafletStyles && leafletStyles.cssRules && leafletStyles.cssRules[0]) leafletStyles.deleteRule(0);
    // }
  }
}

window.customElements.define('u-map', UMap);
