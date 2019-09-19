import {ENV} from '../../../environments/environments';
import {getApiHeaders} from '../../../environments/api';
import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {until} from 'lit-html/directives/until';
import debounce from 'lodash-es/debounce';
import isEmpty from 'lodash-es/isEmpty';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {
  fetchDots,
  setCloudsVisibility,
  setCurrentDotId,
  toggleContextMenu,
  toggleDotCreator,
  toggleTooltip
} from './UMap.actions';
import props from './UMap.props';
import {app} from "../u-app/UApp.reducer";
import {dots, map} from "./UMap.reducer";
import {isAdmin, isAnonymous} from "../u-app/UApp.helpers";

import '../u-context-menu/UContextMenu';
import '../u-tooltip/UTooltip';
import '../u-dot-creator/UDotCreator';
import '../u-dot/UDot';

store.addReducers({ app, map, dots });

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
            opacity: .85;
            transition: opacity .3s;
        }
        
        .leaflet-marker-icon__new {
            filter: hue-rotate(0deg);
        }
        
        .leaflet-marker-icon__old-and-new {
            filter: hue-rotate(-25deg);
        }
        
        .leaflet-marker-icon__old,
        .leaflet-marker-icon__unknown {
            filter: grayscale(100%);
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
            opacity: 1;
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
            border-radius: 10px;
            background-color: #ffffff;
            padding: 0 10px 0 60px;
            min-height: 55px;
            display: flex;
            align-items: center;
            transform: scale(0);
            transition: .2s transform;
        }
        
        .user__menu--active {
            transform: scale(1);
        }
        
        .user__menu-option {
            cursor: pointer;
        }
      </style>
      
      <div class="u-map">
        <div class="${classMap(containerClasses)}">   
          <u-tooltip 
              ?hidden="${!this._tooltip.isVisible}" 
              .x="${this._tooltip.position.x}"
              .y="${this._tooltip.position.y}"
              .origin="${this._tooltip.position.origin}"
              .thumbnail="${this._tooltip.item && this._tooltip.item.images ? `https://urussu.s3.amazonaws.com/${this._getTooltipImage()}` : ''}">
          </u-tooltip>               
          
          ${this._dotPage.isVisible ? html`
              <u-dot .dotId="${this._dotPage.currentDotId}"
                     @hide-dot="${(e) => this._toggleDot(false, e)}"></u-dot>` : ``}
              
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
            html`<a href="https://oauth.vk.com/authorize?client_id=4447151&display=page&redirect_uri=${ENV[window.ENV].static}&response_type=code&v=5.95" class="login"></a>`: 
            html`<div class="user" @click="${this._toggleUserMenu}">
                    <div class="${classMap(userImageClasses)}"></div>
                    <div class="${classMap(userMenuClasses)}">
                        <div class="user__menu-option" @click="${this._logout}">Выйти</div>
                    </div>
                 </div>`
          }
        </div>
        
        <div id="map"></div>
        <!-- <div id="user-role">your role is ${this._user.role}</div> -->
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

    this._dots = state.dots.items;
    this._contextMenu = state.map.contextMenu;
    this._tooltip = state.map.tooltip;
    this._dotCreator = state.map.dotCreator;
    this._clouds = state.map.clouds;
    this._dotPage = state.map.dotPage;
    this._user = state.app.user;

    // show a temporary dot until a real dot is creating
    // remove it when a real one has been created
    if (state.map.dotCreator.tempDot !== null && !this._$tempDot) this._addTempDot(state.map.dotCreator.tempDot.coordinates);
    if (state.map.dotCreator.tempDot === null && this._$tempDot) this._removeTempDot();
  }

  firstUpdated() {
    this._init().catch(e => { throw new Error(e) });
  }

  async _init() {
    this._drawMap();

    this._setStore();
    this._setListeners();
    this._setReferences();
  }

  _setStore() {
    store.dispatch(fetchDots());
  }

  _setListeners() {
    this._map.on('load', UMap._triggerResize());
    this._map.on('click', (e) => this._handleClick(e));
    this._map.on('dblclick', (e) => this._handleDblClick(e));
    this._map.on('dragstart', () => this._hideControls());
    this._map.on('drag', debounce(this._updateUrl, 300).bind(this));
    this.addEventListener('click', this._handleOutsideClicks);
  }

  _setReferences() {
    this._$tempDot = null;
    this._$clouds = this.querySelector('.container');
  }

  _setDefaults() {
    this._tooltipHoverTimeOut = null;
    this._overlayMaps = {};
  }

  /*
      List of custom component's methods
      Any other methods
  */
  _drawMap() {
    this._createMapInstance();
    this._apply1pxGapFix();
    this._setDefaultSettings();
    this._setMaxBounds();
    this._initializeTiles();
    // await this._drawObjects();
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

    L.tileLayer(`${ENV[window.ENV].static}/static/images/tiles/{z}/{x}/{y}.png`, {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      bounds,
      noWrap: true
    }).addTo(this._map);
  }

  // ----- start of drawing methods -----
  async _drawObjects() {
    return Promise.all[this._drawPaths(), this._drawCircles()];
  }

  async _drawPaths() {
    try {
      let response = await fetch(`${ENV[window.ENV].api}/api/objects?include=paths`, { headers: getApiHeaders(localStorage.token) });
      const paths = await response.json();

      paths.forEach(item => {
        L.polygon(item.coordinates, {
          id: item._id,
          color: this.objectFillColor,
          weight: this.objectStrokeWidth
        })
          // .on('mouseover', e => { this._toggleTooltip(true, e) })
          // .on('mouseout', e => { this._toggleTooltip(false, e) })
          .on('click', e => { this._toggleObject(true, e) })
          .addTo(this._map);
      });
    } catch (e) {
      console.error(`Unable to draw paths`, e);
    }
  }

  async _drawCircles() {
    try {
      let response = await fetch(`${ENV[window.ENV].api}/api/objects?include=circles`, { headers: getApiHeaders(localStorage.token) });
      let circles = await response.json();

      circles.forEach(item => {
        L.circle(item.coordinates[0], {
          id: item._id,
          color: this.objectFillColor,
          weight: this.objectStrokeWidth,
          radius: item.coordinates[1]
        })
          // .on('mouseover', e => { this._toggleTooltip(true, e) })
          // .on('mouseout', e => { this._toggleTooltip(false, e) })
          .on('click', e => { this._toggleObject(true, e) })
          .addTo(this._map);
      });
    } catch (e) {
      console.error(`Unable to draw circles`, e);
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
    return L.marker(dot.coordinates, {
      id: dot.id,
      icon: L.icon({
              iconUrl: `${ENV[window.ENV].static}/static/images/markers/default.png`,
              iconSize: [24, 24],
              className: `leaflet-marker-icon__${dot.type}`
            })
    })
        .on('mouseover', e => { this._toggleTooltip(true, e) })
        .on('mouseout', e => { this._toggleTooltip(false, e) })
        .on('click', (e) => { this._toggleDot(true, e) });
  }
  // ----- end of drawing methods -----


  // ----- start of map UI control methods -----
  _toggleTooltip(isVisible, e) {
    if (isVisible) {
      this._tooltipHoverTimeOut = setTimeout(() => {
        let id = e.target.options.id;
        let position = UMap._calculatePosition(e.containerPoint.x, e.containerPoint.y, 120, 120);

        store.dispatch(toggleTooltip(true, id, position));
      }, 1000);
    } else {
      clearTimeout(this._tooltipHoverTimeOut);

      if (this._tooltip.isVisible) {
        store.dispatch(toggleTooltip(false));
      }
    }
  }

  _getTooltipImage() {
    let oldestImage = Math.min(...Object.keys(this._tooltip.item.images));
    return this._tooltip.item.images[oldestImage];
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
  // ----- end of listeners -----
}

window.customElements.define('u-map', UMap);
