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

import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '../u-mainmenu/u-mainmenu';

import '../../reusable/snack-bar';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

import { store } from '../../../store.js';
import { navigate } from '../../../actions/app.js';

class UApp extends connect(store)(LitElement) {
  _render({appTitle, _page, _drawerOpened, _snackbarOpened, _offline}) {
    // Anything that's related to rendering should be done in here.
    return html`
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
        
        --app-drawer-width: 256px;

        --app-primary-color: #E91E63;
        --app-secondary-color: #293237;
        --app-dark-text-color: var(--app-secondary-color);
        --app-light-text-color: white;
        --app-section-even-color: #f7f7f7;
        --app-section-odd-color: white;

        --app-header-background-color: white;
        --app-header-text-color: var(--app-dark-text-color);
        --app-header-selected-color: var(--app-primary-color);

        --app-drawer-background-color: var(--app-secondary-color);
        --app-drawer-text-color: var(--app-light-text-color);
        --app-drawer-selected-color: #78909C;
      }
  
      [hidden] {
        display: none !important;
      }
      
      .main-content--login u-login {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: all;
      }
      
      .main-content--regular u-login {
        display: none;
      }
      
      .main-content--regular .page {
        display: none;
        position: fixed;
        left: 50%;
        bottom: 130px;
        transform: translate(-50%,0);
        z-index: 100;
        width: 700px;
        height: 400px;
        background-color: #ffffff;
        border-radius: 5px;
        pointer-events: all;
      }
      
      .main-content--regular .page[active] {
      }
      
      u-mainmenu:hover + .main-content--regular .page[active] {
        display: block;
      }
      
      .pages {
        pointer-events: all;
      }
    </style>

    <!-- main menu for primary page -->
    <u-mainmenu hidden?="${_page === 'login'}"></u-mainmenu>

    <!-- Main content -->
    <main class$="${_page === 'login' ? 'main-content main-content--login' : 'main-content main-content--regular'}">
      <u-login class="page" active?="${_page === 'login'}"></u-login>
      <u-map class="page" active?="${_page !== 'login'}"></u-map>
      
      <div class="pages">
        <u-urussinka class="page" active?="${_page === 'U★R★U★S★S★I★N★K★A'}"></u-urussinka>
        <u-chekavo class="page" active?="${_page === 'C★H★E★K★A★V★O'}"></u-chekavo>
        <u-otakuj class="page" active?="${_page === 'O★T★O★K★U★J'}"></u-otakuj>
        <u-pechal class="page" active?="${_page === 'P★E★C★H★A★L'}"></u-pechal>
        <u-chopochom class="page" active?="${_page === 'C★H★O★P★O★C★H★O★M'}"></u-chopochom>
        <u-poedu class="page" active?="${_page === 'P★O★E★D★U'}"></u-poedu>
        <u-udoli class="page" active?="${_page === 'U★D★O★L★I'}"></u-udoli>
      </div>
      
      <my-view404 class="page" active?="${_page === 'view404'}"></my-view404>
    </main>

    <snack-bar active?="${_snackbarOpened}">
        You are now ${_offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get properties() {
    return {
      appTitle: String,
      _page: String,
      _drawerOpened: Boolean,
      _snackbarOpened: Boolean,
      _offline: Boolean
    }
  }

  constructor() {
    super();
  }

  _firstRendered() {
    this.authorize();
    installRouter((location) => {
      store.dispatch(navigate(window.decodeURIComponent(location.pathname)))
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
    this._offline = state.app.offline;
    this._snackbarOpened = state.app.snackbarOpened;
    this._drawerOpened = state.app.drawerOpened;
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
      params[temp[0]] = temp[1]
    });

    if (!params || !params.access_token) {
      return '';
    }

    localStorage.access_token = params.access_token;
    return params.access_token;
  }
}

window.customElements.define('u-app', UApp);
