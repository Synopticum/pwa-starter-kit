/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { ENV } from '../../../constants';
import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import '../u-mainmenu/u-mainmenu';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

import { store } from '../../../store.js';
import { navigate } from '../../../actions/app.js';

class UApp extends connect(store)(LitElement) {
  _render({ appTitle, pageTitle, _page }) {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
          display: block;
          position: fixed;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999;
          pointer-events: none;
        }
        
        .pages {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        
        .pages .page {
          display: none;
          position: relative;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
        }
        
        .mainmenu[page-active] ~ .page[active] {
          display: flex;
        }
      </style>
      
      <u-map active?="${_page !== 'login'}"></u-map>     
  
      <div class="login">
        <u-login></u-login>
        <u-success></u-success>
      </div>
  
      <main class="pages">
        <u-mainmenu class="mainmenu" page-active?="${this._isPageActive}"></u-mainmenu>
        
        <u-news class="page" active?="${_page === 'U★R★U★S★S★I★N★K★A'}"></u-news>
        <u-ads class="page" active?="${_page === 'C★H★E★K★A★V★O'}"></u-ads>
        <u-ideas class="page" active?="${_page === 'Z★A★P★I★L★I'}"></u-ideas>
        <u-claims class="page" active?="${_page === 'C★H★O★M★U'}"></u-claims>
        <u-sale class="page" active?="${_page === 'C★H★O★P★O★C★H★O★M'}"></u-sale>
        <u-rides class="page" active?="${_page === 'P★O★E★D★U'}"></u-rides>
        <u-anonymous class="page" active?="${_page === 'U★D★O★L★I'}"></u-anonymous>
      </main>
        
      <u-404 active?="${_page === '404'}"></u-404>
    `;
  }

  static get properties() {
    return {
      appTitle: String,
      pageTitle: String,
      _page: String
    };
  }

  constructor() {
    super();
    this.appTitle = UApp.getAppTitle();
  }

  _firstRendered() {
    this.authorize();
    installRouter((location) => {
      store.dispatch(navigate(window.decodeURIComponent(location.pathname)));
    });
  }

  _didRender(properties, changeList) {
    if ('_page' in changeList) {
      const pageTitle = properties.appTitle + ' / ' + this.pageTitle;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _stateChanged(state) {
    this._page = state.app.page;
    this.pageTitle = state.app.pageTitle;
  }

  async authorize() {
    await this.checkAccessToken();
  }

  async checkAccessToken() {
    if (await UApp.isAccessTokenValid()) {
      // check an existing access token
      console.log('Successful authentication');
    } else {
      // try to get a new access token from the redirect query string
      localStorage.access_token = await this.extractAccessTokenFromHash();
      if (await UApp.isAccessTokenValid(localStorage.access_token)) {
        console.log('Successful authentication');
      } else {
        console.error('Access token is invalid');
      }
    }
  }

  static async isAccessTokenValid() {
    if (localStorage.access_token) {
      const headers = new Headers();
      headers.append('vk-access-token', localStorage.access_token);

      let response = await fetch(`${ENV.api}/api/login/check`, { headers });
      let json = await response.json();
      let isTokenValid = !json.error;

      return isTokenValid;
    }

    return false;
  }

  async extractAccessTokenFromHash() {
    let hash = window.location.hash.substring(1);
    let params = {};

    hash.split('&').map(hk => {
      let temp = hk.split('=');
      params[temp[0]] = temp[1];
    });

    if (!params || !params.access_token) {
      return '';
    }

    localStorage.access_token = params.access_token;
    return params.access_token;
  }

  get _isPageActive() {
    return (this._page !== 'login' && this._page !== '404' && this._page !== '★');
  }

  static getAppTitle() {
    let items = ['Уруссы', 'Уссурийск', 'Уруссняк', 'В Уруссах', 'С Уруссов'];
    return items[Math.floor(Math.random()*items.length)];
  }
}

window.customElements.define('u-app', UApp);
