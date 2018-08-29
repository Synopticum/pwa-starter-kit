import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { store } from '../../../store';
import { connect } from 'pwa-helpers/connect-mixin';

import map from '../../../reducers/map.js';
store.addReducers({
  map
});

class UObjectTooltip extends connect(store)(LitElement) {

  static get properties() {
    return {
      _positionX: { type: Number },
      _positionY: { type: Number },
      _origin: { type: String }
    };
  }

  render() {
    return html`
      ${SharedStyles}
      <style>
        :host {
            position: fixed;
            left: ${this._positionX}px;
            top: ${this._positionY}px;
            min-width: 300px;
            min-height: 150px;
            background-color: #ffffff;
            z-index: 200;
            border: 1px solid blue;
            transform: scale(1);
            transition: transform .3s;
            transform-origin: ${this._origin};
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
        }
      </style>
      
      <div class="object">
        <slot></slot>
      </div> 
    `
  }

  _stateChanged(state) {
    this._positionX = state.map.position.x;
    this._positionY = state.map.position.y;
    this._origin = state.map.position.origin;
  }
}

window.customElements.define('u-object-tooltip', UObjectTooltip);
