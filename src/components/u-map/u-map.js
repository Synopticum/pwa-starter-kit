/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {html} from '@polymer/lit-element';
import {SharedStyles} from '../shared-styles.js';
import {PageViewElement} from '../page-view-element.js';

class UMap extends PageViewElement {

    static get properties() {
        return {
            map: {
                type: Object
            },

            minZoom: {
                type: Number
            },

            maxZoom: {
                type: Number
            },

            maxBounds: {
                type: Array
            },

            mapWidth: {
                type: Number
            },

            mapHeight: {
                type: Number
            },

            objectFillColor: {
                type: String
            },

            objectStrokeWidth: {
                type: Number
            },

            __currentObject: {
                type: Array
            }
        };
    }

    _render(props) {
        return html`              
            ${SharedStyles}
            <style>
            :host {
                box-sizing: border-box;
            }
        
            #map-overlay,
            #map-shadow {
                pointer-events: none;
                position: fixed;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                z-index: 100;
            }
        
            #map-overlay {
                opacity: .05;
                background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADAQMAAABs5if8AAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAA5JREFUCNdjeMDQwNAAAAZmAeFpNQSMAAAAAElFTkSuQmCC');
            }
        
            #map-shadow {
            }
            </style>
              
            <div id="map-overlay"></div>
            <div id="map-shadow"></div>
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
        this.__currentObject = [];

    }

    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    init() {
        this._createMap();
        this._setDefaultSettings();
        this._setMaxBounds();
        this._initializeTiles();
        this._setListeners();
        this._drawObjects();

        // console.log(this.__coordsToPoints([[67.03,4.70], [67.53,5.58], [67.03,6.72], [66.25,6.24]], true));
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
        L.tileLayer('http://127.0.0.1:8081/src/components/u-map/images/tiles/{z}/{x}/{y}.jpg', {
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
        const pathsJson = await fetch('http://localhost:3000/api/objects/coordinates/paths');
        const paths = await pathsJson.json();

        paths.forEach(item => {
            L.polygon(item.coordinates, {
                color: this.objectFillColor,
                weight: this.objectStrokeWidth
            })
                .on('click', this._handleObjectClick)
                .addTo(this.map)
        });
    }

    async _drawCircles() {
        // const circlesJson = await fetch('http://localhost:3000/api/objects/coordinates/circles');
        // const circles = await circlesJson.json();

        [].forEach(item => {
            L.circle(item.coordinates[0], {
                color: this.objectFillColor,
                weight: this.objectStrokeWidth,
                radius: item.coordinates[1] })
                .addTo(this.map);
        });
    }

    static _triggerResize() {
        window.dispatchEvent(new Event('resize'))
    }

    _handleObjectClick(e) {
        let latLngs = e.target.getLatLngs()[0];

        let coordinates = latLngs.map(item => {
            return [item.lat, item.lng];
        });

        fetch(`http://localhost:3000/api/objects?coordinates=${JSON.stringify(coordinates)}`, {
            method: 'get'
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
        });
    }

    __getCoordinates(e) {
        this.__currentObject.push([e.latlng.lat.toFixed(2),e.latlng.lng.toFixed(2)]);
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

window.customElements.define('my-view1', UMap);
