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
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import { getAllNews } from '../../../actions/news.js';

import news from '../../../reducers/news.js';
store.addReducers({
  news
});

class UNews extends connect(store)(PageViewElement) {

  static get properties() {
    return {
      news: Array
    };
  }

  _render({ news }) {
    return html`
      ${SharedStyles}
      
      <style>
        .news {
            width: 90%;
            max-width: 1000px;
            height: 400px;
            background-color: #ffffff;
            border-radius: 5px;
            pointer-events: all;
        }
      </style>
      
      <div class="news">
        ${news}
      </div>
    `;
  }

  _firstRendered() {
    store.dispatch(getAllNews());
  }

  _stateChanged(state) {
    this.news = state.news.all;
  }
}

window.customElements.define('u-news', UNews);
