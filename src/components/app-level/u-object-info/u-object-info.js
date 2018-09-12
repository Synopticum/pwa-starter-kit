import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import { hideObjectInfo } from '../../../actions/map.js';

import map from '../../../reducers/map.js';
store.addReducers({
  map
});

class UObjectInfo extends connect(store)(LitElement) {
  render() {
    return html`
      ${SharedStyles}
      <style>
        :host {
            width: 900px;
            height: 600px;
            background-color: #ffffff;
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
        <div class="close" @click="${UObjectInfo.close}"></div>
        ${this.user.isAdmin ? 'admin' : 'member'}
        <slot></slot>
      </div> 
    `
  }

  _stateChanged(state) {
    this.user = state.user;
  }

  static close() {
    store.dispatch(hideObjectInfo());
  }
}

window.customElements.define('u-object-info', UObjectInfo);
