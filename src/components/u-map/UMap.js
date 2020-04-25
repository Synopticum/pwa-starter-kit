import {ENV} from '../../../environments/environments';
import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import debounce from 'lodash-es/debounce';
import isEmpty from 'lodash-es/isEmpty';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import 'leaflet-rotatedmarker';
import {
  fetchDots,
  fetchObjects,
  setCloudsVisibility,
  setCurrentDotId,
  setCurrentObjectId,
  setCurrentPathId,
  toggleContextMenu,
  toggleDotCreator,
  toggleTooltip,
  setSettings
} from './UMap.actions';
import { putObject } from '../u-object/UObject.actions';
import props from './UMap.props';
import {app} from "../u-app/UApp.reducer";
import {dots, map, objects } from "./UMap.reducer";
import {isAdmin, isAnonymous} from "../u-app/UApp.helpers";

import '../u-context-menu/UContextMenu';
import '../u-tooltip/UTooltip';
import '../u-dot-creator/UDotCreator';
import '../u-dot/UDot';
import '../u-object/UObject';
import '../u-path/UPath';

store.addReducers({ app, map, dots, objects });

class UMap extends connect(store)(LitElement) {
  /*
      List of required methods
      Needed for initialization, rendering, fetching and setting default values
  */
  static get properties() {
    return props;
  }

  render() {
    let containerClasses = {
      'container': true,
      [`container--clouds-${this._clouds.visibility}`]: true
    };

    let userImageClasses = {
      'user__image': true,
      'user__image--none': !this._user.image
    };

    let userMenuClasses = {
      'user__menu': true,
      'user__menu--active': this._isUserMenuVisible
    };

    let tooltipClasses = {
      'tooltip': true,
      'tooltip--dot': this._tooltip.item && this._tooltip.item.instanceType === 'dot',
      'tooltip--path': this._tooltip.item && this._tooltip.item.instanceType === 'path'
    };

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
        }
        
        .container.container--clouds-full::before {
          opacity: .75;
          pointer-events: all;
        }

        #map {
            cursor: ${this._settings.isDrawingObject ? 'default' : 'move'};
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
        
        .leaflet-tile-pane {
            filter: saturate(.3);
        }
        
        path.leaflet-interactive {
            cursor: pointer;
            opacity: .75;
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
          background: linear-gradient(var(--from), var(--to));
          border-radius: 50%;
        }
        
        .leaflet-marker-icon::before {
          content: '';
          position: absolute;
          left: calc(50% - 4.5px);
          top: calc(50% - 12px);
          background: url("data:image/svg+xml,%3C%3Fxml version='1.0' %3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg height='512px' id='Layer_1' style='enable-background:new 0 0 512 512;' version='1.1' viewBox='0 0 512 512' width='512px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpath fill='white' d='M184.7,413.1l2.1-1.8l156.5-136c5.3-4.6,8.6-11.5,8.6-19.2c0-7.7-3.4-14.6-8.6-19.2L187.1,101l-2.6-2.3 C182,97,179,96,175.8,96c-8.7,0-15.8,7.4-15.8,16.6h0v286.8h0c0,9.2,7.1,16.6,15.8,16.6C179.1,416,182.2,414.9,184.7,413.1z'/%3E%3C/svg%3E") no-repeat; 
          background-size: 9px;
          width: 9px;
          height: 9px; 
          transform: rotate(-90deg);
        }
        
        .leaflet-marker-icon:focus {
            outline: none;
        }
        
        .leaflet-marker-icon__new {
            --from: lawngreen;
            --to: lawngreen;
        }
        
        .leaflet-marker-icon__old-and-new {
            --from: #ffb631;
            --to: #ffb631;
        }
        
        .leaflet-marker-icon__old,
        .leaflet-marker-icon__unknown {
            --from: lightgrey;
            --to: lightgrey;
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
        
        .leaflet-control-container {
            z-index: 200;
        }
        
        .leaflet-container .leaflet-tile {
            filter: grayscale(30%);
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
        
        .login {
            position: fixed;
            left: 12px;
            bottom: 12px;
            background: url('/static/images/user.svg') no-repeat 50% 50%;
            background-size: 44px;
            color: #ffffff;
            width: 44px;
            height: 44px;
            z-index: 100;
            opacity: .5;
            transition: opacity .3s;
        }
        
        .login:hover {
            opacity: .75;
        }
        
        .user {
            position: fixed;
            left: 12px;
            bottom: 12px;
            z-index: 5;
        }
        
        .user__image {
            position: relative;
            z-index: 20;
            cursor: pointer;
            width: 44px;
            height: 44px;
            background: url(${this._user.avatar}) no-repeat 50% 50% #ddd;
            background-size: cover;
            border-radius: 50%;
            overflow: hidden;
            text-indent: -9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #111;                  
        }
        
        .user__image--none {
            text-indent: 0;
        }
        
        .user__menu {
            position: absolute;
            top: -5px;
            left: -5px;
            z-index: 10;
            padding: 0 20px 0 60px;
            min-height: 55px;
            display: flex;
            align-items: center;
            transform: scale(0);
            transition: .2s transform;
            box-shadow: transparent 0 0 0 1px inset, rgba(34, 36, 38, 0.15) 0 0 0 0 inset, rgba(0, 0, 0, 0.3) 0px 1px 2px;
            background: 50% 50% no-repeat rgb(224, 225, 226);
            border-radius: 0.285714rem;
        }
        
        .user__menu--active {
            transform: scale(1);
        }
        
        .user__menu-option {
            cursor: pointer;
        }
        
        .settings {
            position: fixed;
            left: 70px;
            bottom: 12px;
            z-index: 5;
        }
        
        .settings__item {
            cursor: pointer;
            width: 44px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background-color: #ffffff;
            opacity: .5;
            transition: opacity .3s;
            user-select: none;
        }
        
        .settings__item:hover {
            opacity: .75;
        }
        
        .settings__item--active,
        .settings__item--active:hover {
            opacity: 1;
        }
      </style>
      
      <div class="u-map">
        <div class="${classMap(containerClasses)}">   
          <u-tooltip 
              class="${classMap(tooltipClasses)}"
              ?hidden="${!this._tooltip.isVisible}" 
              .x="${this._tooltip.position.x}"
              .y="${this._tooltip.position.y}"
              .origin="${this._tooltip.position.origin}"
              .title="${this._tooltip.item && this._tooltip.item.title}"
              .shortDescription="${this._tooltip.item && this._tooltip.item.shortDescription}"
              .type="${this._tooltip.item && this._tooltip.item.type}"
              .instanceType="${this._tooltip.item && this._tooltip.item.instanceType}"
              .thumbnail="${this._tooltip.item && this._tooltip.item.images ? `https://urussu.s3.amazonaws.com/${this._getTooltipImage()}` : ''}">
          </u-tooltip>               
          
          ${this._dotPage.isVisible ? html`
              <u-dot .dotId="${this._dotPage.currentDotId}"
                     @hide-dot="${(e) => this._toggleDot(false, e)}"></u-dot>` : ``}              
          
          ${this._objectPage.isVisible ? html`
              <u-object .objectId="${this._objectPage.currentObjectId}"
                        @hide-object="${(e) => this._toggleObject(false, e)}"></u-object>` : ``}             
          
          ${this._pathPage.isVisible ? html`
              <u-path .pathId="${this._pathPage.currentPathId}"
                        @hide-path="${(e) => this._togglePath(false, e)}"></u-path>` : ``}
              
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
        
          ${isAnonymous(this._user) ?
        html`<a href="https://oauth.vk.com/authorize?client_id=4447151&display=page&redirect_uri=${ENV[window.ENV].static}&response_type=code&v=5.95" class="login"></a>` :
        html`<div class="user" @click="${this._toggleUserMenu}">
                    <div class="${classMap(userImageClasses)}"></div>
                    <div class="${classMap(userMenuClasses)}">
                        <div class="user__menu-option" @click="${this._logout}">Выйти</div>
                    </div>
                 </div>`
    }
        </div>
        
        <div id="map"></div>
      </div>
    `;
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
      this._drawPaths(state.objects.items.filter(object => object.instanceType === 'path'));
    }

    this._objects = state.objects.items;
    this._dots = state.dots.items;
    this._contextMenu = state.map.contextMenu;
    this._tooltip = state.map.tooltip;
    this._dotCreator = state.map.dotCreator;
    this._clouds = state.map.clouds;
    this._dotPage = state.map.dotPage;
    this._objectPage = state.map.objectPage;
    this._pathPage = state.map.pathPage;
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
  }

  _setListeners() {
    this._map.on('load', UMap._triggerResize());
    this._map.on('click', (e) => this._handleClick(e));
    this._map.on('dblclick', (e) => this._handleDblClick(e));
    this._map.on('dragstart', () => this._hideControls());
    this._map.on('drag', debounce(this._updateUrl, 300).bind(this));
    this._map.on('click', this.getCoordinates.bind(this));
    this.addEventListener('click', this._handleOutsideClicks);
  }

  _setReferences() {
    this._$tempDot = null;
    this._$clouds = this.querySelector('.container');
    this.$globalSpinner = document.querySelector('u-global-spinner');
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
    await this._drawObjects();
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
    let lat = 62;
    let lng = 33;

    if (location.search) {
      let params = new URLSearchParams(location.search);
      lat = params.get('lat');
      lng = params.get('lng');
    }
    this._map.setView([lat, lng], 5);
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
      !isEmpty(objects) ? console.error('Unable to draw objects\n\n', e) : '';
    }
  }

  _addObjectsToMap(objects) {
    objects.forEach(object => {
      L.polygon(object.coordinates, {
        id: object.id,
        color: this.objectFillColor,
        weight: this.objectStrokeWidth
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

    store.dispatch(putObject(object));
  }

  _removeCurrentObjects() {
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

  _drawPaths(paths) {
    try {
      this._removeCurrentPaths();
      this._addPathsToMap(paths);
    } catch (e) {
      !isEmpty(objects) ? console.error('Unable to draw objects\n\n', e) : '';
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
    const object = new ObjectModel({
      instanceType: 'path',
      coordinates: coordinates,
      id: uuidv4()
    });

    store.dispatch(putObject(object));
  }

  _removeCurrentPaths() {
    const layers = Object.entries(this._map._layers);

    for (let layer of layers) {
      const [ id ] = layer;

      if (this._map._layers[id]._poly !== undefined) {
        try {
          this._map.removeLayer(this._map._layers[id]);
        }
        catch (e) {
          console.log('Problem with ' + e + this._map._layers[id]);
        }
      }
    }
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
    const icon = L.divIcon({
      iconSize: [9, 9],
      className: `leaflet-marker-icon__${dot.type}`
    });

    return L.marker(dot.coordinates, {
      id: dot.id,
      icon,
      rotationAngle: dot.rotationAngle || 0
    })
        .on('mouseover', e => { this._toggleTooltip('dot',true, e) })
        .on('mouseout', e => { this._toggleTooltip('dot',false, e) })
        .on('click', (e) => { this._toggleDot(true, e) });
  }
  // ----- end of drawing methods -----


  // ----- start of map UI control methods -----
  _toggleTooltip(type, isVisible, e) {
    if (isVisible) {
      this._tooltipHoverTimeOut = setTimeout(() => {
        let id = e.target.options.id;
        let containerWidth, containerHeight;

        switch (type) {
          case 'dot':
            containerWidth = 120;
            containerHeight = 120;
            break;

          case 'path':
            containerWidth = 300;
            containerHeight = 30;
            break;

          case 'object':
            containerWidth = 300;
            containerHeight = 30;
            break;

          default:
            containerWidth = 120;
            containerHeight = 120;
            break;
        }

        let position = UMap._calculatePosition(e.containerPoint.x, e.containerPoint.y, containerWidth, containerHeight);

        store.dispatch(toggleTooltip(type,true, id, position));
      }, 1000);
    } else {
      clearTimeout(this._tooltipHoverTimeOut);

      if (this._tooltip.isVisible) {
        store.dispatch(toggleTooltip(type,false));
      }
    }
  }

  _getTooltipImage() {
    let oldestImage = Math.min(...Object.keys(this._tooltip.item.images));
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
        let position = UMap._calculatePosition(e.containerPoint.x, e.containerPoint.y, 150, 63);
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

  _toggleUserMenu() {
    this._isUserMenuVisible = !this._isUserMenuVisible;
  }

  _logout() {
    localStorage.token = '';
    location.reload();
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


  static _calculatePosition(mouseX, mouseY, containerWidth, containerHeight) {
    let html = document.querySelector('html'),
        x, y, origin;

    html.clientWidth/2 < mouseX ? x = mouseX - containerWidth : x = mouseX;
    html.clientHeight/2 < mouseY ? y = mouseY - containerHeight : y = mouseY;

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


  // ----- start of dot creation methods -----
  _createDot() {
    this._toggleDotCreator(true);
    this._toggleContextMenu(false);
  }

  _addTempDot(coordinates) {
    this._$tempDot = new L.marker(coordinates, {
      icon: L.icon({
        iconUrl: `${ENV[window.ENV].static}/static/images/markers/unknown.png`,
        iconSize: [24, 24], // size of the icon
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
    let { lat, lng } = this._map.getCenter();
    window.history.replaceState( {}, '', `?lat=${lat.toFixed(2)}&lng=${lng.toFixed(2)}`);
    // location.search = `?lat=${lat.toFixed(2)}&lng=${lng.toFixed(2)}`;
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
      this.__currentObject.push([e.latlng.lat.toFixed(2), e.latlng.lng.toFixed(2)]);
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
    this.instanceType = options.instanceType;
  }
}

window.customElements.define('u-map', UMap);
