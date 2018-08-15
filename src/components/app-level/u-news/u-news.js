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
import './u-news-header/u-news-header';

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
            top: -30px;
            width: calc(100vw - 100px);
            height: calc(100vh - 250px);
            pointer-events: all;
            padding: 20px 30px;
        }
        
        .news::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            z-index: 5;
            width: 100%;
            height: 100%;
            background-color: #fff;
            border-radius: 5px;
            transform: perspective(500px) rotateX(-1deg);
        }
        
        .news__layout {
            position: relative;
            z-index: 10;
            display: grid;
            height: 100%;
            grid-template-areas:
              'header     header    header    header'
              'leftside   content   content   rightside'
              'footer     footer    footer    footer';
            grid-template-columns: 1.2fr 2fr 2fr 2fr;
            grid-template-rows: 100px 1fr 50px;
            grid-gap: 1px;
        }
        
        .leftside {
            grid-area: leftside;
            border: 1px solid #ccc;
        }
        
        .content {
            grid-area: content;
            border: 1px solid #ccc;
            overflow-y: auto;
            padding: 20px;
        }
        
        .rightside {
            grid-area: rightside;
            border: 1px solid #ccc;
        }
        
        .footer {
            grid-area: footer;
            border: 1px solid #ccc;
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
        <div class="news__layout">
            <u-news-header></u-news-header>
            
            <div class="leftside"></div>
            
            <div class="content">
              ${repeat(news, item => item.id, item => html`
                <u-news-item item="${item}"></u-news-item>
              `)}
            </div>
            
            <div class="rightside"></div>
            <div class="footer"></div>
        </div>
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
