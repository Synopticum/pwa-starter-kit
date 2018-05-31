import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import { hideObjectInfo } from '../../../actions/map.js';

import map from '../../../reducers/map.js';
store.addReducers({
  map
});

class UObjectInfo extends LitElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <style>
        :host {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            width: 200px;
            height: 200px;
            background-color: #ffffff;
            border: 1px solid green;
            z-index: 200;
            pointer-events: all;
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
        <div class="close" on-click="${UObjectInfo.close}"></div>
        <slot></slot>
      </div> 
    `
  }

  static close() {
    store.dispatch(hideObjectInfo());
  }
}

window.customElements.define('u-object-info', UObjectInfo);
