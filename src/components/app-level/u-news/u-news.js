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
import { repeat } from 'lit-html/lib/repeat';
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
            position: relative;
            width: 90%;
            max-width: 1000px;
            height: 400px;
            background-color: #ffffff;
            border-radius: 5px;
            pointer-events: all;
            overflow-y: auto;
            padding: 20px;
        }
        
        .news__item {
            padding: 10px 0;
            border-bottom: 1px solid #ccc;
        }
        
        .news__link {
            text-align: right;
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
      
      <div class="news">
        <a href="/" class="close"></a>
        
          ${repeat(news, (i) => i.id, (i, index) => html`
            <div class="news__item">
                <div class="news__text">${i.text}</div>
                <div class="news__link"><a href$="${i.link}" target="_blank">Поподробнее</a></div>
            </div>`)}
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
