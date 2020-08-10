import {ENV} from '../../../environments/environments';
import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import debounce from '../../helpers/debounce';
import isEmpty from "../../helpers/isEmpty";
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import 'leaflet-rotatedmarker';
import {
  fetchDots,
  fetchObjects,
  fetchPaths,
  setCloudsVisibility,
  setCurrentDotId,
  setCurrentObjectId,
  setCurrentPathId,
  toggleContextMenu,
  toggleDotCreator,
  toggleTooltip,
  setSettings
} from './UMap.actions';
import { putEntity } from '../u-entity/UEntity.actions';
import props from './UMap.props';
import {app} from "../u-app/UApp.reducer";
import {dots, map, objects, paths } from "./UMap.reducer";
import {isAdmin} from "../u-app/UApp.helpers";

import '../shared/u-context-menu/UContextMenu';
import '../shared/u-tooltip/UTooltip';
import './u-dot-creator/UDotCreator';
import '../u-dot/UDot';
import '../u-object/UObject';
import '../u-path/UPath';
import '../shared/u-noise/UNoise';
import './u-map-range/UMapRange';

store.addReducers({ app, map, dots, objects, paths });

class UMap extends connect(store)(LitElement) {
  /*
      List of required methods
      Needed for initialization, rendering, fetching and setting default values
  */
  static get properties() {
    return props;
  }

  render() {
    const containerClasses = {
      'container': true,
      [`container--clouds-${this._clouds.visibility}`]: true
    };

    const { item, coordinates } = this._tooltip;

    const tooltipClasses = {
      'tooltip': true,
      'tooltip--dot': item && item.instanceType === 'dot',
      'tooltip--object': item && item.instanceType === 'object',
      'tooltip--path': item && item.instanceType === 'path',
      'tooltip--top-left': coordinates && coordinates.origin === 'top left',
      'tooltip--top-right': coordinates && coordinates.origin === 'top right',
      'tooltip--bottom-left': coordinates && coordinates.origin === 'bottom left',
      'tooltip--bottom-right': coordinates && coordinates.origin === 'bottom right'
    };

    const zoom = this._settings.zoom;

    return html`      
      <style>
        [hidden] {
          display: none;
        }
        
        .container {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container::before {
          content: '';
          position: fixed;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          background: url('../../../static/images/clouds65.jpg') no-repeat 50% 50%;
          transition: opacity ease .3s;
          will-change: opacity;
          z-index: 10;
        }
        
        .container.container--clouds-none::before {
          opacity: .1;
          pointer-events: none;
        }
        
        .container.container--clouds-partly::before {
          opacity: .45;
          pointer-events: all;
          z-index: 35;
        }
        
        .container.container--clouds-full::before {
          opacity: .75;
          pointer-events: all;
          z-index: 35;
        }

        #map {
            cursor: ${this._settings.isDrawingObject ? 'default' : 'grab'};
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background-color: #000000;
            pointer-events: all;
        }
        
        #map:active {
            cursor: ${this._settings.isDrawingObject ? 'default' : 'grabbing'};
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
        
        .leaflet-tile-pane {
            filter: none;
            will-change: filter;
        }
        
        .leaflet-control-container {
            top: 20px;
            left: 70px;
            position: relative;
        }
        
        path.leaflet-interactive {
            cursor: pointer;
            /*opacity: .75;*/
            opacity: 0;
            transition: opacity .3s;
        }
        
        path.leaflet-interactive:hover {
            opacity: 1;
        }
        
        path.leaflet-interactive--error {
            pointer-events: none;
            opacity: .75;
            animation-name: disappear;
            animation-duration: 2000ms;
            animation-fill-mode: forwards;
        }
        
        path.leaflet-interactive--has-images {
            /*opacity: .75;*/
        }
        
        @keyframes disappear {
          0% {
            opacity: .75;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            display: none;
            opacity: 0;
          }
        }
        
        .leaflet-marker-icon {
          position: relative;
          background: rgb(232,168,38);
          border: 2px solid rgb(182,118,-12);
          border-radius: 50%;
          width: ${zoom === 4 ? 6 : zoom === 5 ? 9 : zoom === 6 ? 12 : 9}px !important;
          height: ${zoom === 4 ? 6 : zoom === 5 ? 9 : zoom === 6 ? 12 : 9}px !important;
        }
        
        .leaflet-marker-icon::before {
            pointer-events: none;
            content: '';
            position: absolute;
            left: calc(50% - ${zoom === 4 ? 3 : zoom === 5 ? 4.5 : zoom === 6 ? 6 : 9}px);
            top: calc(50% - ${zoom === 4 ? 9 : zoom === 5 ? 12 : zoom === 6 ? 16 : 9}px);
            background: url("data:image/svg+xml,%3C%3Fxml version='1.0' %3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg height='512px' id='Layer_1' style='enable-background:new 0 0 512 512;' version='1.1' viewBox='0 0 512 512' width='512px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpath fill='white' d='M184.7,413.1l2.1-1.8l156.5-136c5.3-4.6,8.6-11.5,8.6-19.2c0-7.7-3.4-14.6-8.6-19.2L187.1,101l-2.6-2.3 C182,97,179,96,175.8,96c-8.7,0-15.8,7.4-15.8,16.6h0v286.8h0c0,9.2,7.1,16.6,15.8,16.6C179.1,416,182.2,414.9,184.7,413.1z'/%3E%3C/svg%3E") no-repeat; 
            background-size: ${zoom === 4 ? 6 : zoom === 5 ? 9 : zoom === 6 ? 12 : 9}px;
            width: ${zoom === 4 ? 6 : zoom === 5 ? 9 : zoom === 6 ? 12 : 9}px;
            height: ${zoom === 4 ? 6 : zoom === 5 ? 9 : zoom === 6 ? 12 : 9}px;
            transform: rotate(-90deg);
            box-sizing: border-box;
        }
        
        .leaflet-marker-icon::after {
            pointer-events: none;
            opacity: 0;
            content: '';
            position: absolute;
            left: -5px;
            bottom: -5px;
            width: 20px;
            height: 70px;
            background: rgb(255,241,224);
            -webkit-mask-image: -webkit-gradient(linear, left bottom, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
            transform: perspective(25px) rotateX(-40deg);
            transition: opacity .3s;
            filter: blur(5px);
        }
        
        .leaflet-marker-icon:hover::after {
            opacity: 1;
        }
        
        .leaflet-marker-icon:focus {
            outline: none;
        }
        
        .leaflet-marker-icon__gold {
            background-color: #ffb631;
            border-color: darkgoldenrod;
        }
        
        .leaflet-marker-icon:hover {
            opacity: 1;
        }
        
        .leaflet-marker-icon--is-updating {
            cursor: default;
            pointer-events: none;
            opacity: .3;
            filter: grayscale(100%);
        }
        
        .leaflet-control-layers {
            display: none;
        }
        
        .leaflet-control-attribution {
            margin: 0 20px 20px 0 !important;
            background: none !important;
        }
        
        .leaflet-control-attribution a {
            color: #fff !important;
            text-decoration: none !important;
            opacity: .5;
        }
        
        .leaflet-editing-icon {
            width: 4px !important;
            height: 4px !important;
            margin-left: -2px !important;
            margin-top: -2px !important;
            background-color: #DEAF5A !important;
            border-radius: 50%;
        }
        
        #user-role {
            position: fixed;
            right: 0;
            bottom: 0;
            background-color: #ff0000;
            color: #ffffff;
            padding: 10px;
        }
        
        #noise {
            --z-index: 15;
            --background-color: rgba(0,0,0,.1);
            --noise-opacity: .1;
        }
      </style>
      
      <div class="u-map">
        <div class="${classMap(containerClasses)}">   
          <u-tooltip 
              class="${classMap(tooltipClasses)}"
              ?hidden="${!this._tooltip.isVisible}" 
              .position="${this._tooltip.coordinates.position}"
              .origin="${this._tooltip.coordinates.origin}"
              .title="${this._tooltip.item && this._tooltip.item.title}"
              .shortDescription="${this._tooltip.item && this._tooltip.item.shortDescription}"
              .street="${this._tooltip.item && this._tooltip.item.street}"
              .house="${this._tooltip.item && this._tooltip.item.house}"
              .type="${this._tooltip.item && this._tooltip.item.type}"
              .instanceType="${this._tooltip.item && this._tooltip.item.instanceType}"
              .instanceId="${this._tooltip.item && this._tooltip.item.id}"
              .thumbnail="${this._tooltip.item && this._tooltip.item.images ? `https://urussu.s3.amazonaws.com/${this._getTooltipImage()}` : ''}"
              @mouseout="${() => this._toggleTooltip('dot',false)}">
          </u-tooltip>     
              
          <u-context-menu
              ?hidden="${!this._contextMenu.isVisible}"
              .x="${this._contextMenu.position.x}"
              .y="${this._contextMenu.position.y}"
              .origin="${this._contextMenu.position.origin}">
                <div class="menu__item" @click="${this._createDot}" slot="context-menu-items">Добавить точку</div>
                <div class="menu__item" @click="${() => alert(1)}" slot="context-menu-items">Проверить</div>   
          </u-context-menu>
          
          <u-dot-creator 
              ?hidden="${!this._dotCreator.isVisible}"
              .x="${this._dotCreator.position.x}"
              .y="${this._dotCreator.position.y}"
              .lat="${this._dotCreator.position.lat}"
              .lng="${this._dotCreator.position.lng}"></u-dot-creator>
        </div>
        
        <u-map-range 
            current-min="1940" 
            current-max="2020" 
            min="1940" 
            max="2020" 
            @update-range="${debounce(this.updateRange.bind(this), 300)}"></u-map-range>
        
        <div id="map"></div>
        <u-noise id="noise"></u-noise>
      </div>
    `;
  }

  updateRange({ detail: { range: [min, max], sepia } }) {
    this.updateMarkers(min, max);
    this.updateSepia(sepia);
  }

  updateMarkers(min, max) {
    const layers = document.querySelectorAll('.leaflet-control-layers-selector');

    // hide all layers
    for (let layer of layers) {
      const input = layer;

      if (input.checked) {
        input.nextSibling.click();
        input.checked = false;
      }
    }

    // show layers that in range
    for (let layer of layers) {
      const input = layer;
      const value = input.nextSibling.textContent.trim();

      if (value >= min && value <= max) {
        input.nextSibling.click();
        input.checked = true;
      }
    }
  }

  updateSepia(sepia) {
    this.$tilePane.style.filter = `sepia(${sepia})`;
  }

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this._setDefaults();
  }

  stateChanged(state) {
    if (this._dots !== state.dots.items) {
      this._drawDots(state.dots.items);
    }

    if (this._objects !== state.objects.items) {
      this._drawObjects(state.objects.items.filter(object => object.instanceType === 'object'));
      this._drawCircles(state.objects.items.filter(object => object.instanceType === 'circle'));
    }

    if (this._paths !== state.paths.items) {
      this._drawPaths(state.paths.items);
    }

    this._objects = state.objects.items;
    this._dots = state.dots.items;
    this._paths = state.paths.items;
    this._contextMenu = state.map.contextMenu;
    this._tooltip = state.map.tooltip;
    this._dotCreator = state.map.dotCreator;
    this._clouds = state.map.clouds;
    this._settings = state.map.settings;
    this._user = state.app.user;

    if (this._user.role === 'admin' && !this._areDrawToolsVisible) {
        this._initializeLeafletDraw();
        this._areDrawToolsVisible = true;
    }

    // show a temporary dot until a real dot is creating
    // remove it when a real one has been created
    if (state.map.dotCreator.tempDot !== null && !this._$tempDot) this._addTempDot(state.map.dotCreator.tempDot.coordinates);
    if (state.map.dotCreator.tempDot === null && this._$tempDot) this._removeTempDot();

    if (state.objects.failedObject !== null && state.objects.failedObject.coordinates) this._showPuttingObjectError(state.objects.failedObject);
    if (state.paths.failedPath !== null && state.paths.failedObject.coordinates) this._showPuttingObjectError(state.paths.failedPath);
  }

  firstUpdated() {
    this._init()
        .then(() => { this.$globalSpinner.setAttribute('idle', 'true') })
        .catch(e => { throw new Error(e) });
  }

  async _init() {
    await this._drawMap();

    this._setStore();
    this._setListeners();
    this._setReferences();
  }

  _setStore() {
    store.dispatch(fetchDots());
    store.dispatch(fetchObjects());
    store.dispatch(fetchPaths());
  }

  _setListeners() {
    this._map.on('load', UMap._triggerResize());
    this._map.on('click', (e) => this._handleClick(e));
    this._map.on('dblclick', (e) => this._handleDblClick(e));
    this._map.on('dragstart', () => this._hideControls());
    this._map.on('drag', debounce(this._updateUrl.bind(this), 50));
    this._map.on('zoomend', this._updateUrl.bind(this));
    this._map.on('click', this.getCoordinates.bind(this));
    this.addEventListener('click', this._handleOutsideClicks);
    // this.addEventListener('u-tooltip::show-dot', e => this._toggleDot(true, { target: { options: e.detail }}));
    // this.addEventListener('u-tooltip::show-object', e => this._toggleDot(true, { target: { options: e.detail }}));
  }

  _setReferences() {
    this._$tempDot = null;
    this._$clouds = this.querySelector('.container');
    this.$globalSpinner = document.querySelector('u-global-spinner');
    this.$tilePane = document.querySelector('.leaflet-tile-pane');
  }

  _setDefaults() {
    this._tooltipHoverTimeOut = null;
    this._overlayMaps = {};
    this.__currentObject = [];
  }

  /*
      List of custom component's methods
      Any other methods
  */
  async _drawMap() {
    this._createMapInstance();
    this._apply1pxGapFix();
    this._setDefaultSettings();
    this._setMaxBounds();
    this._initializeTiles();
  }

  _createMapInstance() {
    this._map = L.map('map', {});
    this._map.doubleClickZoom.disable();
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
    let lat = 69.65;
    let lng = -20.25;
    let zoom = 5;

    if (location.search) {
      let params = new URLSearchParams(location.search);
      lat = params.get('lat');
      lng = params.get('lng');
      zoom = params.get('zoom');
    } else {
      const url = `?lat=${lat.toFixed(2)}&lng=${lng.toFixed(2)}&zoom=${zoom}`
      window.history.replaceState( {}, '', url);
    }

    this._map.setView([lat, lng], zoom);
    this._updateUrl();
  }

  _setMaxBounds() {
    this._map.setMaxBounds(this.maxBounds);
  }

  _initializeTiles() {
    const bounds = new L.LatLngBounds(
        this._map.unproject([0, this.height], this.maxZoom),
        this._map.unproject([this.width, 0], this.maxZoom)
    );
    const tileExtension = UMap.doesBrowserSupportWebP() ? 'png.webp' : 'png';

    L.tileLayer(`${ENV[window.ENV].static}/static/images/tiles/{z}/{x}/{y}.${tileExtension}`, {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      bounds,
      noWrap: true
    }).addTo(this._map);
  }

  _initializeLeafletDraw() {
    this._editableLayers = new L.FeatureGroup();
    this._map.addLayer(this._editableLayers);

    var options = {
      position: 'topleft',
      draw: {
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons

          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },

          shapeOptions: {
            color: '#97009c'
          }
        },
        polyline: {
          shapeOptions: {
            color: '#f357a1',
            weight: 10
          }
        },
        circle: true,
        rectangle: false,
        marker: false,
        circlemarker: false
      }
    };

    this.drawControl = new L.Control.Draw(options);
    this._map.addControl(this.drawControl);

    this._map.on('draw:created', (e) => {
      let type = e.layerType,
          layer = e.layer,
          coordinates;

      switch (type) {
        case 'polygon':
          coordinates = e.layer.editing.latlngs[0];
          this.addObjectToMap(coordinates);
          break;

        case 'polyline':
          coordinates = e.layer.editing.latlngs[0];
          this.addPathToMap(coordinates);
          break;

        case 'circle':
          const radius = e.layer._mRadius;
          const latlng = e.layer._latlng;
          this.addCircleToMap(latlng, radius);
          break;
      }

      this._editableLayers.addLayer(layer);
    });
  }

  // ----- start of drawing methods -----
  _drawObjects(objects) {
    try {
      this._removeCurrentObjects();
      this._addObjectsToMap(objects);
    } catch (e) {
      Array.isArray(objects) && !objects.length ? console.error('Unable to draw objects\n\n', e) : '';
    }
  }

  _addObjectsToMap(objects) {
    objects.forEach(object => {
      let color;

      if (object.street && object.house) {
        color = this.objectFillColor;
      } else if (object.street === '' && object.house === '') {
        color = '#00f';
      } else {
        color = '#f00';
      }

      L.polygon(object.coordinates, {
        id: object.id,
        color,
        weight: this.objectStrokeWidth,
        className: object.images ? 'leaflet-interactive--has-images' : ''
      })
      .on('mouseover', e => { this._toggleTooltip('object', true, e) })
      .on('mouseout', e => { this._toggleTooltip('object', false, e) })
      .on('click', e => { this._toggleObject(true, e) })
          .addTo(this._map);
    });
  }

  addObjectToMap(coordinates) {
    const object = new ObjectModel({
      instanceType: 'object',
      coordinates: coordinates,
      id: uuidv4()
    });

    store.dispatch(putEntity('object', object));
  }

  _removeCurrentObjects() {
    // const layers = Object.entries(this._map._layers);
    //
    // for (let layer of layers) {
    //   const [ id ] = layer;
    //
    //   if (this._map._layers[id]._path !== undefined) {
    //     try {
    //       this._map.removeLayer(this._map._layers[id]);
    //     }
    //     catch (e) {
    //       console.log('Problem with ' + e + this._map._layers[id]);
    //     }
    //   }
    // }
  }

  _drawPaths(paths) {
    try {
      this._removeCurrentPaths();
      this._addPathsToMap(paths);
    } catch (e) {
      !isEmpty(paths) ? console.error('Unable to draw paths\n\n', e) : '';
    }
  }

  _addPathsToMap(paths) {
    paths.forEach(path => {
      L.polyline(path.coordinates, {
        id: path.id,
        color: 'green',
        weight: 8
      })
      .on('mouseover', e => { this._toggleTooltip('path',true, e) })
      .on('mouseout', e => { this._toggleTooltip('path',false, e) })
          .on('click', e => { this._togglePath(true, e) })
          .addTo(this._map);
    });
  }

  addPathToMap(coordinates) {
    const path = new PathModel({
      instanceType: 'path',
      coordinates: coordinates,
      id: uuidv4()
    });

    store.dispatch(putEntity('path', path));
  }

  _removeCurrentPaths() {
    const layers = Object.entries(this._map._layers);

    for (let layer of layers) {
      const [ id ] = layer;

      if (this._map._layers[id]._path !== undefined) {
        try {
          this._map.removeLayer(this._map._layers[id]);
        }
        catch (e) {
          console.log('Problem with ' + e + this._map._layers[id]);
        }
      }
    }
  }

  _drawCircles(circles) {
    try {
      // this._removeCurrentCircles();
      this._addCirclesToMap(circles);
    } catch (e) {
      !isEmpty(circles) ? console.error('Unable to draw circles\n\n', e) : '';
    }
  }

  _addCirclesToMap(circles) {
    circles.forEach(circle => {
      const { coordinates, radius } = circle;

      L.circle(coordinates[0], radius, {
        id: circle.id,
        color: 'rgb(255, 198, 0)',
        weight: 2
      })
          // .on('mouseover', e => { this._toggleTooltip('path',true, e) })
          // .on('mouseout', e => { this._toggleTooltip('path',false, e) })
          // .on('click', e => { this._togglePath(true, e) })
          .addTo(this._map);
    });
  }

  addCircleToMap(coordinates, radius) {
    const object = new ObjectModel({
      instanceType: 'circle',
      coordinates: coordinates,
      radius,
      id: uuidv4()
    });

    store.dispatch(putEntity('object', object));
  }

  _updateMarkerCoordinates(value, e) {
    const marker = e.target;
    const position = marker.getLatLng();
    const { lat, lng } = position;

    store.dispatch(putEntity('dot', { id: marker.options.id, coordinates: [lat, lng] }));
  }

  _drawDots(dots) {
    try {
      this._removeCurrentLayersAndMarkers();
      this._addMarkersToMap(dots);
      this._addLayersToMap();
    } catch (e) {
      !isEmpty(dots) ? console.error('Unable to draw dots\n\n', e) : '';
    }
  }

  _removeCurrentLayersAndMarkers() {
    if (this._layerControl) this._layerControl.remove();
    if (this._overlayMaps) Object.values(this._overlayMaps).forEach(layer => this._map.removeLayer(layer));
  }

  _addMarkersToMap(dots) {
    for (let layerName of UMap._getDotLayers(dots)) {
      let layerDots = dots.filter(dot => dot.layer === layerName);
      this._overlayMaps[layerName] = L.layerGroup(layerDots.map(dot => this._createMarker(dot)));
    }
  }

  _addLayersToMap() {
    Object.values(this._overlayMaps).forEach(layer => layer.addTo(this._map));
    this._layerControl = L.control.layers(null, this._overlayMaps).addTo(this._map);
  }

  static _getDotLayers(dots) {
    return new Set(dots.map(dot => dot.layer));
  }

  _createMarker(dot) {
    let className;
    const year = dot.images ? Object.keys(dot.images)[0] : 1940;
    const hasMoreThanOneImage = dot.images && Array.isArray(Object.keys(dot.images)) && Object.keys(dot.images).length > 1;

    if (hasMoreThanOneImage) {
      className = `leaflet-marker-icon__${year}`;
    } else {
      className = `leaflet-marker-icon__${year}`;
    }

    const icon = L.divIcon({
      iconSize: [9, 9],
      className
    });

    return L.marker(dot.coordinates, {
      id: dot.id,
      icon,
      draggable: false,
      rotationAngle: dot.rotationAngle || 0
    })
        .on('mouseover', e => { this._toggleTooltip('dot',true, e) })
        .on('mouseout', () => clearTimeout(this._tooltipHoverTimeOut))
        .on('click', e => { this._toggleDot(true, e) })
        .on('dragend', e => { this._updateMarkerCoordinates(null, e); });
  }
  // ----- end of drawing methods -----


  // ----- start of map UI control methods -----
  _toggleTooltip(type, isVisible, e) {
    if (isVisible) {
      this._tooltipHoverTimeOut = setTimeout(() => {
        let id = e.target.options.id;

        const { top, right, bottom, left } = e.originalEvent.target.getBoundingClientRect();
        let coordinates = UMap._calculateTooltipPosition(type, { top, right, bottom, left });

        store.dispatch(toggleTooltip(type,true, id, coordinates));
      }, 1000);
    } else {
      clearTimeout(this._tooltipHoverTimeOut);

      if (this._tooltip.isVisible) {
        store.dispatch(toggleTooltip(type,false));
      }
    }
  }

  _getTooltipImage() {
    const images = Object.keys(this._tooltip.item.images).filter(name => !name.includes('_'));
    const oldestImage = Math.min(...images);
    return this._tooltip.item.images[oldestImage];
  }

  _toggleObject(isVisible, e) {
    if (isVisible) {
      store.dispatch(setCurrentObjectId(''));
      requestAnimationFrame(() => store.dispatch(setCurrentObjectId(e.target.options.id)));
    } else {
      store.dispatch(setCurrentObjectId(''));
    }
  }

  _togglePath(isVisible, e) {
    if (isVisible) {
      store.dispatch(setCurrentPathId(''));
      requestAnimationFrame(() => store.dispatch(setCurrentPathId(e.target.options.id)));
    } else {
      store.dispatch(setCurrentPathId(''));
    }
  }

  _toggleDot(isVisible, e) {
    if (isVisible) {
        store.dispatch(setCurrentDotId(''));
        requestAnimationFrame(() => store.dispatch(setCurrentDotId(e.target.options.id)));

        store.dispatch(toggleDotCreator(false, { x: this._dotCreator.position.x, y: this._dotCreator.position.y }));

        if (this._dotCreator.isVisible) {
            this._toggleDotCreator(false);
        }
    } else {
      store.dispatch(setCurrentDotId(''));
    }
  }

  _toggleContextMenu(isVisible, e) {
    if (isAdmin(this._user)) {
      if (isVisible) {
        let position = UMap._calculateContextMenuPosition(e.containerPoint.x, e.containerPoint.y, 150, 63);
        store.dispatch(toggleContextMenu(true, position));
      } else {
        store.dispatch(toggleContextMenu(false, { x: this._contextMenu.position.x, y: this._contextMenu.position.y }));
      }
    }
  }

  _toggleDotCreator(isVisible) {
    if (isVisible) {
      store.dispatch(setCloudsVisibility('full'));
      store.dispatch(toggleDotCreator(true, this._tempDotCoordinates));
    } else {
      store.dispatch(setCloudsVisibility('none'));
      store.dispatch(toggleDotCreator(false, { x: this._dotCreator.position.x, y: this._dotCreator.position.y }));
    }
  }

  _showPuttingObjectError(object) {
    const options = {
      id: object.id,
      color: '#f00',
      weight: this.objectStrokeWidth,
      className: 'leaflet-interactive--error'
    };

    L.polygon(object.coordinates, options).addTo(this._map);
  }
  // ----- end of map UI control methods -----


  static _calculateTooltipPosition(type, position) {
    const html = document.querySelector('html');
    const { top, right, bottom, left } = position;
    let origin;

    const params = {
      'dot': {
        right: html.clientWidth - right,
        left
      },
      'object': {
        right: html.clientWidth - left,
        left: right
      }
    };

    const ratherTop = Math.abs(html.clientHeight/2-top) > Math.abs(html.clientHeight/2-bottom);
    const ratherBottom = Math.abs(html.clientHeight/2-top) < Math.abs(html.clientHeight/2-bottom);
    const ratherLeft = Math.abs(html.clientWidth/2-left) > Math.abs(html.clientWidth/2-right);
    const ratherRight = Math.abs(html.clientWidth/2-left) < Math.abs(html.clientWidth/2-right);

    if (ratherBottom && ratherRight) {
      origin = 'bottom right';
    } else if (ratherTop && ratherRight) {
      origin = 'top right';
    } else if (ratherBottom && ratherLeft) {
      origin = 'bottom left';
    } else if (ratherTop && ratherLeft) {
      origin = 'top left';
    }

    return {
      position: {
        top: (top+((bottom-top)/2)) - 30,
        right: params[type].right,
        bottom: (html.clientHeight-top-((bottom-top)/2)) - 30,
        left: params[type].left
      },
      origin
    };
  }

  static _calculateContextMenuPosition(x, y, width, height) {
    return { x, y, origin: 'top left' };
  }

  // ----- start of dot creation methods -----
  _createDot() {
    this._toggleDotCreator(true);
    this._toggleContextMenu(false);
  }

  _addTempDot(coordinates) {
    this._$tempDot = new L.marker(coordinates, {
      icon: L.divIcon({
        iconSize: [9, 9],
        className: `leaflet-marker-icon__unknown`
      })
    })
        .on('click', (e) => { this._toggleDot(true, e) })
        .addTo(this._map);
    this._$tempDot._icon.classList.add('leaflet-marker-icon--is-updating');
  }

  _removeTempDot() {
    this._$tempDot.remove();
    this._$tempDot = null;
  }
  // ----- end of dot creation methods -----


  // ----- start of listeners -----
  static _triggerResize() {
    window.dispatchEvent(new Event('resize'));
  }

  _handleClick(e) {
    this._toggleContextMenu(false);
    this._toggleDotCreator(false);
  }

  _handleDblClick(e) {
    this._toggleContextMenu(true, e);

    this._tempDotCoordinates = {
      x: e.containerPoint.x,
      y: e.containerPoint.y,
      lat: e.latlng.lat,
      lng: e.latlng.lng
    }
  }

  _hideControls() {
    this._toggleContextMenu(false);
    this._toggleDotCreator(false);
  }

  _updateUrl() {
    const { lat, lng } = this._map.getCenter();
    const zoom = this._map.getZoom();

    const url = `?lat=${lat.toFixed(2)}&lng=${lng.toFixed(2)}&zoom=${zoom}`
    window.history.replaceState( {}, '', url);

    store.dispatch(setSettings('zoom', zoom));
  }

  _handleOutsideClicks(e) {
    if (e.target === this._$clouds) {
      this._toggleDotCreator(false);
      this._toggleDot(false);
    }
  }

  toggleIsDrawingObject() {
    store.dispatch(setSettings('isDrawingObject', !this._settings.isDrawingPath));
    this.__currentObject = [];
  }

  getCoordinates(e) {
    if (this._settings.isDrawingObject) {
      const [lat, lng] = [e.latlng.lat.toFixed(2), e.latlng.lng.toFixed(2)];
      // alert(`[${lat}, ${lng}]`);
      this.__currentObject.push([lat, lng]);
    }
  }
  // ----- end of listeners -----

  static doesBrowserSupportWebP() {
    var elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) {
      // was able or not to get WebP representation
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // very old browser like IE 8, canvas not supported
    return false;
  }
}

class ObjectModel {
  constructor(options) {
    this.id = uuidv4();
    this.coordinates = options.coordinates;
    this.radius = options.radius;
    this.instanceType = options.instanceType;
  }
}

class PathModel {
  constructor(options) {
    this.id = uuidv4();
    this.coordinates = options.coordinates;
    this.instanceType = options.instanceType;
  }
}

window.customElements.define('u-map', UMap);
