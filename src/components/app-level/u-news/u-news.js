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
      news: { type: Array }
    };
  }

  render() {
    return html`
      ${SharedStyles}
      
      <style>
        .news {
            position: relative;
            top: -40px;
            width: calc(100vw - 80px);
            height: calc(100vh - 130px);
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
            transform: perspective(450px) rotateX(-1deg);
        }
        
        .news__layout {
            position: relative;
            z-index: 10;
            display: grid;
            height: 100%;
            grid:
              'header     header     header     header'  190px
              'spacer     spacer     spacer     spacer'  10px
              'content    content    content    content' 1fr
              'footer     footer     footer     footer'  50px /
              200px       2fr        2fr        2fr;
            grid-gap: 1px;
        }
        
        .spacer {
            grid-area: spacer;
            border-top: 2px solid grey;
        }
        
        .content {
            grid-area: content;
            display: grid;
            max-height: 100%;
            grid-template-areas:
              'leftside   center   center   rightside';
            grid-template-columns: 200px 2fr 2fr 2fr;
            grid-gap: 1px;
            overflow-y: auto;
        }
        
        u-news-leftside {
            grid-area: leftside;
        }
        
        u-news-main {
            grid-area: center;
        }
        
        .rightside {
            grid-area: rightside;
        }
        
        .footer {
            grid-area: footer;
            border: 1px solid #eee;
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
            <div class="spacer"></div>
            
            <div class="content">
              <u-news-leftside></u-news-leftside>
              <u-news-main items="${this.news}"></u-news-main>
              <u-news-rightside></u-news-rightside>
            </div>
            
            <div class="footer"></div>
        </div>
      </div>
`;
  }

  firstRendered() {
    store.dispatch(getAllNews());
  }

  _stateChanged(state) {
    this.news = state.news.all;
  }
}

window.customElements.define('u-news', UNews);
