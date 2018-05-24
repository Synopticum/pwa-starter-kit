/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import '../u-mainmenu/u-mainmenu';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

import { store } from '../../../store.js';
import { navigate } from '../../../actions/app.js';

class UApp extends connect(store)(LitElement) {
  _render({ appTitle, _page }) {
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
        
        .pages .page {
          display: none;
        }
        
        .mainmenu:hover + .pages .page[active] {
          display: block;
        }
      </style>
      
      <u-map active?="${_page !== 'login'}"></u-map>     
  
      <u-login></u-login>
      <u-mainmenu class="mainmenu"></u-mainmenu>  
  
      <main class="pages">       
        <u-urussinka class="page" active?="${_page === 'U★R★U★S★S★I★N★K★A'}"></u-urussinka>
        <u-chekavo class="page" active?="${_page === 'C★H★E★K★A★V★O'}"></u-chekavo>
        <u-otakuj class="page" active?="${_page === 'O★T★O★K★U★J'}"></u-otakuj>
        <u-chomu class="page" active?="${_page === 'C★H★O★M★U'}"></u-chomu>
        <u-chopochom class="page" active?="${_page === 'C★H★O★P★O★C★H★O★M'}"></u-chopochom>
        <u-poedu class="page" active?="${_page === 'P★O★E★D★U'}"></u-poedu>
        <u-udoli class="page" active?="${_page === 'U★D★O★L★I'}"></u-udoli>
      </main>
        
      <my-view404 active?="${_page === 'view404'}"></my-view404>
    `;
  }

  static get properties() {
    return {
      appTitle: String,
      _page: String
    };
  }

  constructor() {
    super();
  }

  _firstRendered() {
    this.authorize();
    installRouter((location) => {
      store.dispatch(navigate(window.decodeURIComponent(location.pathname)));
    });
  }

  _didRender(properties, changeList) {
    if ('_page' in changeList) {
      const pageTitle = properties.appTitle + ' - ' + changeList._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _stateChanged(state) {
    this._page = state.app.page;
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

      let response = await fetch(`http://localhost:3000/api/login/check`, { headers });
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
}

window.customElements.define('u-app', UApp);
