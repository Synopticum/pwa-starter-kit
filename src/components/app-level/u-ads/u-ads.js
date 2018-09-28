/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { PageViewElement } from '../../reusable/page-view-element';

import { store } from '../../../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { map } from '../../../components/app-level/u-map/redux';
store.addReducers({ map });

class UAds extends connect(store)(PageViewElement) {

  render() {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
        }
        
        .ads {
            position: relative;
            width: 90%;
            max-width: 1000px;
            height: 400px;
            background-color: #ffffff;
            border-radius: 5px;
            pointer-events: all;
        }
        
        .close {
            cursor: pointer;
            position: absolute;
            display: block;
            right: -15px;
            top: -15px;
            width: 30px;
            height: 30px;
            background-color: #ff0000;
        }
      </style>
      
      <div class="ads">
        <a href="/" class="close"></a>
        Chekavo
      </div>
    `;
  }

  _stateChanged() {

  }
}

window.customElements.define('u-ads', UAds);
