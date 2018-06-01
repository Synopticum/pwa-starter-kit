import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import { hideObjectEditor } from '../../../actions/map.js';

import map from '../../../reducers/map.js';
store.addReducers({
  map
});

class UObjectEditor extends connect(store)(LitElement) {

  static get properties() {
    return {
      _object: String
    };
  }

  _render({ _object }) {
    return html`
      ${SharedStyles}
      <style>
        :host {
            width: 900px;
            height: 600px;
            background-color: #faa;
            border: 1px solid green;
            z-index: 200;
            pointer-events: all;
            transform: scale(1);
            transition: transform .3s;
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
            width: 0;
            height: 0;
        }
        
        .close {
            cursor: pointer;
            position: absolute;
            right: -15px;
            top: -15px;
            width: 30px;
            height: 30px;
            background-color: #ff0000;
        }
      </style>
      
      <div class="object">
        <div class="close" on-click="${UObjectEditor.close}"></div>
        ${_object._id}
      </div> 
    `
  }

  constructor() {
    super();
    this._object = {};
  }

  _stateChanged(state) {
    this._object = state.map.object;
  }

  static close() {
    store.dispatch(hideObjectEditor());
  }
}

window.customElements.define('u-object-editor', UObjectEditor);
