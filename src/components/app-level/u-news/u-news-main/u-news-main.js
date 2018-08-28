/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../../shared-styles.js';
import { PageViewElement } from '../../../reusable/page-view-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { repeat } from 'lit-html/lib/repeat';


import { store } from '../../../../store';

import news from '../../../../reducers/news.js';
store.addReducers({
  news
});


class UNewsMain extends connect(store)(LitElement) {

  static get properties() {
    return {
      items: Array
    };
  }

  _render({ items }) {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
            display: grid;
            padding: 0 20px;
            grid:
                'center-label .'                25px
                'center-spacer center-spacer'   10px
                'center-content center-content' 1fr / 
                minmax(0, 400px) 1fr;
        }
        
        .label {
            grid-area: center-label; 
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            background-color: #111111;
            color: #ffffff;
            text-align: center;
            text-transform: uppercase;
            font-size: 14px;
        }
        
        .spacer {
            grid-area: center-spacer; 
        }
        
        .content {
            grid-area: center-content; 
        }
      </style>
      
      
      <div class="label">Сводки с полей</div>
      <div class="spacer"></div>
      <div class="content">
        ${repeat(items, item => item.id, item => html`
          <u-news-item item="${item}"></u-news-item>
        `)}
      </div>
`;
  }

  _firstRendered() {
  }

  _stateChanged(state) {
  }
}

window.customElements.define('u-news-main', UNewsMain);
