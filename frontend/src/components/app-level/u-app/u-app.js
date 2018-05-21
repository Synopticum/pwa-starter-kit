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

      .main-content {
        min-height: 100vh;
      }
      
      app-header {
        display: none;
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 50;
        pointer-events: all;
      }
      
      app-header::before {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        opacity: .6;
        background: url('../../../../static/images/clouds65.jpg') no-repeat 50% 50%;
      }
      
      app-header[active] {
        display: block;
      }
      
      .pages {
        pointer-events: all;
      }

      .page {
        display: none;
        position: relative;
        z-index: 100;
      }

      .page[active] {
        display: block;
        pointer-events: all;
      }
      
      .toolbar-list {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 100;
      }
      
      .toolbar-list::before {
        content: '';
      }
      
      .toolbar-list a {
        position: absolute;
        left: 50%;
        top: 50%;
        color: #f00;
        margin: 0 10px;
        text-decoration: none;
        outline: none;
        width: 200px;
        height: 150px;
      }
      
      .toolbar-list a img {
        transition: transform .2s;
        will-change: transform;
      }
      
      .toolbar-list a:hover img {
        transform: scale(1.1);
      }
      
      .toolbar-list a.urussinka {
        width: 285px;
        height: 285px;
        transform: translate(calc(-50% - 20px), calc(-50% - 100px));
        font-size: 0;
        text-align: center;
      }
      
      .toolbar-list a.urussinka img,
      .toolbar-list a.urussinka:hover img {
        will-change: inherit;
        filter: none;
        transition: none;
        transform: none;
      }
      
      .chekavo {
        transform: translate(calc(-50% - 212px), calc(-50% - 179px));
      }
      
      .pechal {
        transform: translate(calc(-50% - 178px), calc(-50% + 125px));
      }
      
      .chopochom {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(calc(-50% + 226px), calc(-50% + -121px));
      }
      
      .udoli {
        transform: translate(calc(-50% + 88px), calc(-50% + 146px));
      }
      
      .poedu {
        transform: translate(calc(-50% + 308px), calc(-50% + 48px));
      }
      
      .otokuj {
        transform: translate(calc(-49% - 332px), calc(-50% + -18px));
      }
    </style>

    <!-- Header -->
    <app-header active?="${_page !== 'login'}">
      <!-- This gets hidden on a small screen-->
      <nav class="toolbar-list">
        <a selected?="${_page === '★'}" href="★">★</a>
        
        <a selected?="${_page === 'U★R★U★S★S★I★N★K★A'}" href="U★R★U★S★S★I★N★K★A" class="urussinka">
            <img src="static/images/mainmenu/news.svg" width="153" height="214">
            <img src="static/images/mainmenu/title.svg" width="282" height="69">
        </a>
        
        <a selected?="${_page === 'C★H★E★K★A★V★O'}" href="C★H★E★K★A★V★O" class="chekavo"><img src="static/images/mainmenu/chekavo.svg"></a>        
        <a selected?="${_page === 'O★T★O★K★U★J'}" href="O★T★O★K★U★J" class="otokuj"><img src="static/images/mainmenu/otokuj.svg"></a>        
        <a selected?="${_page === 'P★E★C★H★A★L'}" href="P★E★C★H★A★L" class="pechal"><img src="static/images/mainmenu/pechal.svg"></a>        
        <a selected?="${_page === 'C★H★O★P★O★C★H★O★M'}" href="C★H★O★P★O★C★H★O★M" class="chopochom"><img src="static/images/mainmenu/chopochom.svg"></a>
        <a selected?="${_page === 'P★O★E★D★U'}" href="P★O★E★D★U" class="poedu"><img src="static/images/mainmenu/poedu.svg"></a>
        <a selected?="${_page === 'U★D★O★L★I'}" href="U★D★O★L★I" class="udoli"><img src="static/images/mainmenu/udoli.svg"></a>
      </nav>
    </app-header>

    <!-- Main content -->
    <main class="main-content">
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
    
    <!-- clip paths for menu items -->
    <svg width="0" height="0">
        <defs>
            <clipPath id="chekavo">
                <path id="chekavo" transform="scale(1.2)"
                      d="M163.3,112.12c9.83-13.64,2.9-38.95-3.9-58.06-4.93-13.83-11.42-23.17-19-29.36A46.5,46.5,0,0,0,124,16.19a74.54,74.54,0,0,0-20.86-2.67C77.61,13.14,72.32,2.57,52.16.3,41.2-.94,32.84,1.72,27.53,7.69c-3.27,3.68-5.39,8.63-6.23,14.7a114.29,114.29,0,0,1-2.67,15.25A85.23,85.23,0,0,1,14.86,49C12.55,54.6,9.59,60.44,5.73,68c-7.28,14.27-11.22,41.2,11,57.82,7.91,5.64,17.48,5.86,27.8,4.23,16.71-2.65,35.35-10.14,52-7.3C116.53,126.16,145.49,139.85,163.3,112.12Z"/>
            </clipPath>
        </defs>
    </svg>
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
