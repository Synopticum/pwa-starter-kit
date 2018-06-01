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
      _positionX: Number,
      _positionY: Number,
    };
  }

  _render({ _positionX, _positionY }) {
    return html`
      ${SharedStyles}
      <style>
        :host {
            position: fixed;
            left: ${_positionX}px;
            top: ${_positionY}px;
            min-width: 300px;
            min-height: 150px;
            background-color: #ffffff;
            z-index: 200;
            border: 1px solid blue;
            transform: scale(1);
            transition: transform .3s;
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
  }
}

window.customElements.define('u-object-tooltip', UObjectTooltip);
