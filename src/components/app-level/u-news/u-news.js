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
        
        .news__paper {
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
            grid-template-columns: 1fr 2fr 2fr 2fr;
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
        }
        
        .rightside {
            grid-area: rightside;
            border: 1px solid #ccc;
        }
        
        .footer {
            grid-area: footer;
            border: 1px solid #ccc;
        }
        
        .news__wrapper {
            position: relative;
            z-index: 10;
            display: grid;
            grid-template-columns: repeat(4, 1fr 20px);
            padding: 0;
            height: 100%;
            overflow-y: auto;
            display: none;
        }
        
        .news__image img {
            width: 100%;
            filter: grayscale(100%);
        }
        
        .news__item {
            padding: 10px 0;
            border-bottom: 1px solid #ccc;
        }
        
        .news__text {
            line-height: 1.3;
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
            <div class="content"></div>
            <div class="rightside"></div>
            <div class="footer"></div>
        </div>
        <div class="news__wrapper">
            <!--<a href="/" class="close"></a>        -->
            ${repeat(news, item => item.id, item => html`
              <div class="news__item">
                <div class="news__image">${this.getPhoto(item)}</div>
                <div class="news__text">${item.text}</div>
              </div>
              <div class="spacer"></div>
            `)}
        </div>
        
        <div class="news__paper"></div>
      </div>
`;
  }

  _firstRendered() {
    store.dispatch(getAllNews());
  }

  _stateChanged(state) {
    this.news = state.news.all;
  }

  getPhoto(item, size = 604) {
    let url = item.attachments ? item.attachments[0] ? item.attachments[0].photo ? item.attachments[0].photo[`photo_${size}`] ? item.attachments[0].photo[`photo_${size}`] : null : null : null : null;

    return url ? html`<a href$="${item.link}" target="_blank"><img src="${url}"></a>` : '';
  }
}

window.customElements.define('u-news', UNews);
