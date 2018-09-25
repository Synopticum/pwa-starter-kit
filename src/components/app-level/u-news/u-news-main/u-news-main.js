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
import { repeat } from 'lit-html/directives/repeat';


import { store } from '../../../../store';

import news from '../../../../reducers/news.js';
import { updateMainNewsScroll } from '../../../../actions/news';
store.addReducers({
  news
});


class UNewsMain extends connect(store)(LitElement) {

  static get properties() {
    return {
      items: { type: Array },
      scrollTop: { type: Number },
      isScrollTopVisible: { type: Boolean },
      isScrollBottomVisible: { type: Boolean }
    };
  }

  render() {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
            display: grid;
            padding: 0 20px;
            grid:
                'label .'         25px
                'spacer spacer'   10px
                'content content' 1fr / 
                minmax(0, 400px)  1fr;
            overflow: hidden;
        }
        
        .label {
            grid-area: label; 
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
            grid-area: spacer; 
        }
        
        .content {
            grid-area: content;
            position: relative;
            overflow: hidden;
        }
        
        .content__wrapper {
            width: calc(100% + 20px);
            padding-right: 20px;
            max-height: 100%;
            overflow-y: scroll;
        }
        
        .scroll-up, .scroll-down {
            position: absolute;
            left: 0;
            width: 100%;
            height: 100px;
            pointer-events: none;
            opacity: 0;
            transition: opacity .2s;
        }
        
        .scroll-up[visible], .scroll-down[visible] {
            opacity: 1;
        }
        
        .scroll-up {
            top: 0;
            background: linear-gradient(rgba(255,255,255,1), rgba(255,255,255,0));
        }
        
        .scroll-down {
            bottom: 0;
            background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1));
        }
      </style>
      
      
      <div class="label">Сводки с кукурузных полей</div>
      <div class="spacer"></div>
      <div class="content">
        <div class="scroll-up" ?visible="${this.isScrollTopVisible}"></div>        
        <div class="content__wrapper" @scroll="${this.scroll}">
          ${repeat(this.items, item => item.id, item => html`
            <u-news-item .item="${item}"></u-news-item>
          `)}
        </div>        
        <div class="scroll-down" ?visible="${this.isScrollBottomVisible}"></div>  
      </div>
`;
  }

  firstUpdated() {
    this.isScrollBottomVisible = true;
  }

  _stateChanged(state) {
    if (state.news.mainNewsScroll) {
      this.scrollTop = state.news.mainNewsScroll.scrollTop;
      this.isScrollTopVisible = state.news.mainNewsScroll.isScrollTopVisible;
      this.isScrollBottomVisible = state.news.mainNewsScroll.isScrollBottomVisible;
    }
  }

  scroll(e) {
    let target = e.currentTarget;
    let scrollTop = target.scrollTop;
    let isScrollBottomVisible = target.clientHeight !== target.scrollHeight - target.scrollTop;
    let isScrollTopVisible = target.scrollTop > 0;

    store.dispatch(updateMainNewsScroll({ scrollTop, isScrollTopVisible: isScrollTopVisible, isScrollBottomVisible: isScrollBottomVisible }));
  }
}

window.customElements.define('u-news-main', UNewsMain);
