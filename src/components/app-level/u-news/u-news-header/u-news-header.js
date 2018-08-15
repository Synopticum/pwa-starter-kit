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

import { store } from '../../../../store';

import news from '../../../../reducers/news.js';
store.addReducers({
  news
});

class UNewsHeader extends connect(store)(LitElement) {

  static get properties() {
  }

  _render({ }) {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
            grid-area: header;
            border: 1px solid #ccc;
            display: grid;
            height: 100%;
            grid-template-areas:
              'label     today      today      date'
              'logo      title      title      date'
              'since     caption    caption    email';
            grid-template-columns: 1fr 1.5fr 2fr .5fr;
            grid-template-rows: 25px 1fr 25px;
            grid-gap: 1px;
        }
        
        .header__label {
            grid-area: label;
            border: 1px solid #eee;
        }
        
        .header__today {
            grid-area: today;
            border: 1px solid #eee;
        }
        
        .header__date {
            grid-area: date;
            border: 1px solid #eee;
        }
        
        .header__logo {
            grid-area: logo;
            border: 1px solid #eee;
        }
        
        .header__title {
            grid-area: title;
            border: 1px solid #eee;
        }
        
        .header__since {
            grid-area: since;
            border: 1px solid #eee;
        }
        
        .header__caption {
            grid-area: caption;
            border: 1px solid #eee;
        }
        
        .header__email {
            grid-area: email;
            border: 1px solid #eee;
        }
      </style>
      
      <div class="header__label"></div>
      <div class="header__today"></div>
      <div class="header__date"></div>
      <div class="header__logo"></div>
      <div class="header__title"></div>
      <div class="header__since"></div>
      <div class="header__caption"></div>
      <div class="header__email"></div>
`;
  }

  _stateChanged(state) {
  }
}

window.customElements.define('u-news-header', UNewsHeader);
