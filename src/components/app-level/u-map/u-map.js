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

import { store } from '../../../store';
import { connect } from 'pwa-helpers/connect-mixin';
import { toggleTooltip, toggleContextMenu, toggleDotCreate, map } from '../../../components/app-level/u-map/redux';
import { getObjectInfoById, object } from '../../../components/app-level/u-object/redux';
import { getDotInfoById, getDots, dot, dots } from '../../../components/app-level/u-dot/redux';
store.addReducers({ map, object, dot, dots });

const headers = {
  'Content-Type': 'application/json',
  'Token': localStorage.token
};

class UMap extends connect(store)(LitElement) {

  static get properties() {
    return {
      minZoom: {
        type: Number,
        attribute: 'min-zoom'
      },
      maxZoom: {
        type: Number,
        attribute: 'max-zoom'
      },
      maxBounds: {
        type: { fromAttribute: JSON.parse, toAttribute: JSON.stringify },
        attribute: 'max-bounds'
      },
      width: {
        type: Number,
        attribute: 'width'
      },
      height: {
        type: Number,
        attribute: 'height'
      },
      objectFillColor: {
        type: String,
        attribute: 'object-fill-color'
      },
      objectStrokeWidth: {
        type: Number,
        attribute: 'object-stroke-width'
      },

      _map: {
        type: Object,
        attribute: false
      },

      // object tooltip/info
      _tooltipObject: {
        type: Object,
        attribute: false
      },
      _isObjectInfoVisible: {
        type: Boolean,
        attribute: false
      },

      _isTooltipVisible: {
        type: Boolean,
        attribute: false
      },
      _tooltipPosition: {
        type: Object,
        attribute: false
      },
      _objectHoverTimeOut: {
        type: Number,
        attribute: false
        // delay to show a tooltip
      },

      // dot
      _tempDotRef: {
        type: Object,
        attribute: false
        // need for storing temporary data about where a marker will be added
      },
      _isDotInfoVisible: {
        type: Boolean,
        attribute: false
      },
      _isDotUpdating: {
        type: Boolean,
        attribute: false
      },

      // context menu
      _contextMenu: {
        type: Object,
        attribute: false
      },

      // create dot
      _isDotCreateVisible: {
        type: Boolean,
        attribute: false
      },
      _dotCreateCoordinates: {
        type: Object,
        attribute: false
      },

      // debug
      __currentObject: {
        type: Array,
        attribute: false
      }
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
        <u-object-tooltip 
            ?hidden="${!this._isTooltipVisible}" 
            .x="${this._tooltipPosition.x}"
            .y="${this._tooltipPosition.y}"
            .origin="${this._tooltipOrigin}">${this._tooltipObject ? this._tooltipObject._id : ''}</u-object-tooltip>
        
        <u-object ?hidden="${!this._isObjectInfoVisible}"></u-object>
        
        <u-dot ?hidden="${!this._isDotInfoVisible}"></u-dot>
            
        <u-context-menu
            ?hidden="${!this._contextMenu.isVisible}"
            .x="${this._contextMenu.position.x}"
            .y="${this._contextMenu.position.y}">
              <div class="menu__item" @click="${this._createDot.bind(this)}" slot="context-menu-items">Add a dot</div>
              <div class="menu__item" @click="${() => { alert(1) }}" slot="context-menu-items">Alert</div>   
        </u-context-menu>
        
        <u-dot-create 
            ?hidden="${!this._isDotCreateVisible}"
            .x="${this._dotCreateCoordinates.x}"
            .y="${this._dotCreateCoordinates.y}"
            .lat="${this._dotCreateCoordinates.lat}"
            .lng="${this._dotCreateCoordinates.lng}"></u-dot-create>
      </div>
      
      <div id="map"></div>
    `;
  }

  constructor() {
    super();

    this._map = null;
    this._objectHoverTimeOut = null;
    this.__currentObject = [];
  }

  async init() {
    this._createMap();
    this._setDefaultSettings();
    this._setMaxBounds();
    this._initializeTiles();
    this._setListeners();
    await this._drawObjects();
    store.dispatch(getDots());
  }

  firstUpdated() {
    this.init().catch(e => { throw new Error(e) });
  }

  _stateChanged(state) {
    if (this._dots !== state.dots.items) {
      this._drawDots(state.dots.items);
    }
    this._dots = state.dots.items;

    this._isObjectInfoVisible = state.object.isVisible;

    this._tooltipObject = state.map.tooltipObject;
    this._isTooltipVisible = state.map.isTooltipVisible;
    this._tooltipPosition = state.map.tooltipPosition;
    this._tooltipOrigin = state.map.tooltipPosition.origin;

    this._isDotInfoVisible = state.dot.isVisible;
    this._isDotUpdating = state.dot.isUpdating;

    this._contextMenu = state.map.contextMenu;

    this._isDotCreateVisible = state.map.isDotCreateVisible;
    this._dotCreateCoordinates = state.map.dotCreateCoordinates;

    if (this._tempDotRef && state.dot.isUpdating === false) {
      this._enableDot();
    }
  }

  _createMap() {
    this._map = L.map('map', {});
  }

  _setDefaultSettings() {
    this._map.setView([70, 30], 5);
  }

  _setMaxBounds() {
    this._map.setMaxBounds(this.maxBounds);
  }

  _getBounds() {
    return new L.LatLngBounds(
      this._map.unproject([0, this.height], this.maxZoom),
      this._map.unproject([this.width, 0], this.maxZoom)
    );
  }

  _initializeTiles() {
    L.tileLayer(`${ENV.static}/static/images/tiles/{z}/{x}/{y}.jpg`, {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      bounds: this._getBounds(),
      noWrap: true
    }).addTo(this._map);
  }

  _setListeners() {
    this._map.on('load', UMap._triggerResize());
    this._map.on('click', this._handleClick.bind(this));
    this._map.on('dragstart', this._hideElements.bind(this));
    this._map.on('keypress', this.__drawHelper.bind(this));
  }

  async _drawObjects() {
    return Promise.all[this._drawPaths(), this._drawCircles()];
  }

  async _drawPaths() {
    try {
      let response = await fetch(`${ENV.api}/api/objects?include=paths`, { headers });
      const paths = await response.json();

      paths.forEach(item => {
        L.polygon(item.coordinates, {
          id: item._id,
          color: this.objectFillColor,
          weight: this.objectStrokeWidth
        })
          .on('mouseover', this._showObjectTooltip.bind(this))
          .on('mouseout', this._hideObjectTooltip.bind(this))
          .on('click', this._showObjectInfo.bind(this))
          .addTo(this._map);
      });
    } catch (e) {
      console.error(`Unable to draw paths`, e);
    }
  }

  async _drawCircles() {
    try {
      let response = await fetch(`${ENV.api}/api/objects?include=circles`, { headers });
      let circles = await response.json();

      circles.forEach(item => {
        L.circle(item.coordinates[0], {
          id: item._id,
          color: this.objectFillColor,
          weight: this.objectStrokeWidth,
          radius: item.coordinates[1]
        })
          .on('mouseover', this._showObjectTooltip.bind(this))
          .on('mouseout', this._hideObjectTooltip.bind(this))
          .on('click', this._showObjectInfo.bind(this))
          .addTo(this._map);
      });
    } catch (e) {
      console.error(`Unable to draw circles`, e);
    }
  }

  _drawDots(dots) {
    try {
      // remove current layers and markers
      if (this._layerControl) this._layerControl.remove();
      if (this._overlayMaps) Object.values(this._overlayMaps).forEach(layer => this._map.removeLayer(layer));

      let getMarker = (dot) => L.marker(dot.coordinates, { id: dot.id, icon: UMap.getMarkerIcon(dot.type) }).on('click', this._showDotInfo.bind(this));

      let dotLayers = new Set(dots.map(dot => dot.layer));
      this._overlayMaps = {};

      for (let layerName of dotLayers) {
        let layerDots = dots.filter(dot => dot.layer === layerName);
        this._overlayMaps[layerName] = L.layerGroup(layerDots.map(getMarker));
      }

      Object.values(this._overlayMaps).forEach(layer => layer.addTo(this._map));
      this._layerControl = L.control.layers(null, this._overlayMaps).addTo(this._map);
    } catch (e) {
      console.error(`Unable to draw dots`, e);
    }
  }

  _showObjectTooltip(e) {
    if (!this._isObjectInfoVisible) {
      this._objectHoverTimeOut = setTimeout(() => {
        let objectId = e.target.options.id;
        let position = UMap._calculateTooltipPosition(e.containerPoint.x, e.containerPoint.y);

        store.dispatch(toggleTooltip(true, objectId, position));
      }, 1000);
    }
  }

  _hideObjectTooltip() {
    clearTimeout(this._objectHoverTimeOut);

    if (this._isTooltipVisible) {
      store.dispatch(toggleTooltip(false));
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
      if (this._isTooltipVisible) {
        store.dispatch(toggleTooltip(false));
      }

      let objectId = e.target.options.id;
      store.dispatch(getObjectInfoById(objectId));
    }

    if (this._isDotCreateVisible) {
      this._hideCreateDot();
    }
  }

  _showDotInfo(e) {
    if (!e.originalEvent.altKey) {
      let dotId = e.target.options.id;
      store.dispatch(getDotInfoById(dotId));
      store.dispatch(toggleDotCreate(false));

      if (this._isDotCreateVisible) {
        this._hideCreateDot();
      }
    }
  }

  _handleClick(e) {
    if (e.originalEvent.altKey && !this._isDotUpdating) {
      UMap._showContextMenu(e);

      this._tempDotCoordinates = {
        x: e.containerPoint.x,
        y: e.containerPoint.y,
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }
    } else {
      this._hideContextMenu();
      this._hideCreateDot();
    }
  }

  static _showContextMenu(e) {
    store.dispatch(toggleContextMenu(true, { x: e.containerPoint.x, y: e.containerPoint.y }));
  }

  _hideElements() {
    this._hideContextMenu();
    this._hideCreateDot();
  }

  _hideContextMenu() {
    store.dispatch(toggleContextMenu(false, { x: this._contextMenu.position.x, y: this._contextMenu.position.y }));
  }

  _showCreateDot() {
    store.dispatch(toggleDotCreate(true, this._tempDotCoordinates));
  }

  _hideCreateDot() {
    store.dispatch(toggleDotCreate(false, { x: this._dotCreateCoordinates.x, y: this._dotCreateCoordinates.y }));
  }

  static getMarkerIcon(type) {
    return L.icon({
      iconUrl: `${ENV.static}/static/images/markers/${type}.png`,
      iconSize: [32, 32], // size of the icon
    })
  }

  _createDot() {
    this._showCreateDot();

    // display ghost marker until a dot is created
    this._tempDotRef = new L.marker([this._tempDotCoordinates.lat, this._tempDotCoordinates.lng], { id: dot.id, icon: UMap.getMarkerIcon('global') })
      .on('click', this._showDotInfo.bind(this))
      .addTo(this._map);
    this._tempDotRef._icon.classList.add('leaflet-marker-icon--is-updating');

    this._hideContextMenu();
  }

  _enableDot() {
    this._tempDotRef.remove();
    this._tempDotRef = null;
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
    //   this._map._container.style.cursor = 'wait';
    //   if (leafletStyles) leafletStyles.insertRule('.leaflet-interactive { cursor: wait !important }', 0);
    // } else {
    //   this._map._container.style.cursor = 'default';
    //   if (leafletStyles && leafletStyles.cssRules && leafletStyles.cssRules[0]) leafletStyles.deleteRule(0);
    // }
  }
}

window.customElements.define('u-map', UMap);
