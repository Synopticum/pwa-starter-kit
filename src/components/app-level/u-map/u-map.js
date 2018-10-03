import { ENV } from '../../../../constants';
import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';

import { store } from '../../../store';
import { connect } from 'pwa-helpers/connect-mixin';
import { toggleTooltip, toggleContextMenu, toggleDotCreator, setCurrentObjectId, setCurrentDotId, map } from '../../../components/app-level/u-map/redux';
import { getDots, dots } from '../../../components/app-level/u-dot/redux';
import { app } from '../../../components/app-level/u-app/redux';
store.addReducers({ app, map, dots });

const headers = {
  'Content-Type': 'application/json',
  'Token': localStorage.token
};

class UMap extends connect(store)(LitElement) {

  static get properties() {
    return {
      // setup leaflet
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
      _objectHoverTimeOut: {
        type: Number,
        attribute: false
        // delay to show a tooltip
      },

      // setup interactive elements on map
      _objectPage: {
        type: Object,
        attribute: false
      },
      _dotPage: {
        type: Object,
        attribute: false
      },

      _tooltip: {
        type: Object,
        attribute: false
      },
      _contextMenu: {
        type: Object,
        attribute: false
      },
      _dotCreator: {
        type: Object,
        attribute: false
      },

      _tempDotRef: {
        type: Object,
        attribute: false
        // need for storing temporary data about where a marker will be added
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
        .controls {
            width: 100vw;
            height: 100vh;
            z-index: 200;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .controls::before {
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
      
      <div class="controls">
        <u-object-tooltip 
            ?hidden="${!this._tooltip.isVisible}" 
            .x="${this._tooltip.position.x}"
            .y="${this._tooltip.position.y}"
            .origin="${this._tooltip.position.origin}">${this._tooltip.object ? this._tooltip.object._id : ''}</u-object-tooltip>            
        
        ${this._objectPage.isVisible
          ? html`<u-object .id="${this._objectPage.currentObjectId}" @hide="${(e) => { this._toggleObject(false, e) }}"></u-object>`
          : ``
        }        
        
        ${this._dotPage.isVisible
          ? html`<u-dot .id="${this._dotPage.currentDotId}" @hide="${(e) => { this._toggleDot(false, e) }}"></u-dot>`
          : ``
        }
            
        <u-context-menu
            ?hidden="${!this._contextMenu.isVisible}"
            .x="${this._contextMenu.position.x}"
            .y="${this._contextMenu.position.y}">
              <div class="menu__item" @click="${this._createDot.bind(this)}" slot="context-menu-items">Add a dot</div>
              <div class="menu__item" @click="${() => { alert(1) }}" slot="context-menu-items">Alert</div>   
        </u-context-menu>
        
        <u-dot-creator 
            ?hidden="${!this._dotCreator.isVisible}"
            .x="${this._dotCreator.position.x}"
            .y="${this._dotCreator.position.y}"
            .lat="${this._dotCreator.position.lat}"
            .lng="${this._dotCreator.position.lng}"></u-dot-creator>
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

  firstUpdated() {
    this.init().catch(e => { throw new Error(e) });
  }

  _stateChanged(state) {
    if (this._dots !== state.dots.items) {
      this._drawDots(state.dots.items);
    }
    this._dots = state.dots.items;

    this._contextMenu = state.map.contextMenu;
    this._tooltip = state.map.tooltip;
    this._dotCreator = state.map.dotCreator;

    this._objectPage = state.map.objectPage;
    this._dotPage = state.map.dotPage;

    if (this._tempDotRef) {
      this._enableDot();
    }
  }

  // leaflet init methods
  async init() {
    this._createMap();
    this._apply1pxGapFix();
    this._setDefaultSettings();
    this._setMaxBounds();
    this._initializeTiles();
    this._setListeners();
    await this._drawObjects();
    store.dispatch(getDots());
  }

  _createMap() {
    this._map = L.map('map', {});
  }

  _apply1pxGapFix() {
    if (window.navigator.userAgent.indexOf('Chrome') > -1) {
      var originalInitTile = L.GridLayer.prototype._initTile;
      L.GridLayer.include({
        _initTile: function (tile) {
          originalInitTile.call(this, tile);
          var tileSize = this.getTileSize();
          tile.style.width = tileSize.x + 1 + 'px';
          tile.style.height = tileSize.y + 1 + 'px';
        }
      });
    }
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
    this._map.on('dragstart', this._hideControls.bind(this));
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
          .on('mouseover', e => { this._toggleTooltip(true, e) })
          .on('mouseout', e => { this._toggleTooltip(false, e) })
          .on('click', e => { this._toggleObject(true, e) })
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
          .on('mouseover', e => { this._toggleTooltip(true, e) })
          .on('mouseout', e => { this._toggleTooltip(false, e) })
          .on('click', e => { this._toggleObject(true, e) })
          .addTo(this._map);
      });
    } catch (e) {
      console.error(`Unable to draw circles`, e);
    }
  }

  _drawDots(dots) {
    if (dots.length) {
      try {
        // remove current layers and markers
        if (this._layerControl) this._layerControl.remove();
        if (this._overlayMaps) Object.values(this._overlayMaps).forEach(layer => this._map.removeLayer(layer));

        let getMarker = (dot) => L.marker(dot.coordinates, { id: dot.id, icon: UMap.getMarkerIcon(dot.type) }).on('click', (e) => { this._toggleDot(true, e) });

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
  }

  static getMarkerIcon(type) {
    return L.icon({
      iconUrl: `${ENV.static}/static/images/markers/${type}.png`,
      iconSize: [32, 32], // size of the icon
    })
  }

  // global control
  _handleClick(e) {
    if (e.originalEvent.altKey) {
      this._toggleContextMenu(true, e);

      this._tempDotCoordinates = {
        x: e.containerPoint.x,
        y: e.containerPoint.y,
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }
    } else {
      this._toggleContextMenu(false);
      this._toggleDotCreator(false);
    }
  }

  _hideControls() {
    this._toggleContextMenu(false);
    this._toggleDotCreator(false);
  }

  static _triggerResize() {
    window.dispatchEvent(new Event('resize'));
  }

  // tooltip control
  _toggleTooltip(isVisible, e) {
    if (isVisible) {
      this._objectHoverTimeOut = setTimeout(() => {
        let objectId = e.target.options.id;
        let position = UMap._calculateTooltipPosition(e.containerPoint.x, e.containerPoint.y);

        store.dispatch(toggleTooltip(true, objectId, position));
      }, 1000);
    } else {
      clearTimeout(this._objectHoverTimeOut);

      if (this._tooltip.isVisible) {
        store.dispatch(toggleTooltip(false));
      }
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

  // object page control
  _toggleObject(isVisible, e) {
    if (isVisible) {
      if (!e.originalEvent.altKey) {
        if (this._tooltip.isVisible) {
          store.dispatch(toggleTooltip(false));
        }

        store.dispatch(setCurrentObjectId(''));
        requestAnimationFrame(() => store.dispatch(setCurrentObjectId(e.target.options.id)));
      }

      if (this._dotCreator.isVisible) {
        this._toggleDotCreator(false);
      }
    } else {
      store.dispatch(setCurrentObjectId(''));
    }
  }

  // dot page control
  _toggleDot(isVisible, e) {
    if (isVisible) {
      if (!e.originalEvent.altKey) {
        store.dispatch(setCurrentDotId(''));
        requestAnimationFrame(() => store.dispatch(setCurrentDotId(e.target.options.id)));

        store.dispatch(toggleDotCreator(false, { x: this._dotCreator.position.x, y: this._dotCreator.position.y }));

        if (this._dotCreator.isVisible) {
          this._toggleDotCreator(false);
        }
      }
    } else {
      store.dispatch(setCurrentDotId(''));
    }
  }

  // context menu control
  _toggleContextMenu(isVisible, e) {
    if (isVisible) {
      store.dispatch(toggleContextMenu(true, { x: e.containerPoint.x, y: e.containerPoint.y }));
    } else {
      store.dispatch(toggleContextMenu(false, { x: this._contextMenu.position.x, y: this._contextMenu.position.y }));
    }
  }

  // dot creator control
  _toggleDotCreator(isVisible) {
    if (isVisible) {
      store.dispatch(toggleDotCreator(true, this._tempDotCoordinates));
    } else {
      store.dispatch(toggleDotCreator(false, { x: this._dotCreator.position.x, y: this._dotCreator.position.y }));
    }
  }

  _createDot() {
    this._toggleDotCreator(true);

    // display ghost marker until a dot is created
    this._tempDotRef = new L.marker([this._tempDotCoordinates.lat, this._tempDotCoordinates.lng], { icon: UMap.getMarkerIcon('global') })
      .on('click', (e) => { this._toggleDot(true, e) })
      .addTo(this._map);
    this._tempDotRef._icon.classList.add('leaflet-marker-icon--is-updating');

    this._toggleContextMenu(false);
  }

  _enableDot() {
    this._tempDotRef.remove();
    this._tempDotRef = null;
  }

  // debug
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
}

window.customElements.define('u-map', UMap);
