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

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      ${SharedStyles}
      
      <style>        
        .pages {
          position: fixed;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
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
      
      <u-map></u-map>   
  
      <main class="pages">
        <u-mainmenu class="mainmenu" ?page-active="${this._isPageActive}"></u-mainmenu>
        
        <u-news class="page" ?active="${this._page === 'U★R★U★S★S★I★N★K★A'}"></u-news>
        <u-ads class="page" ?active="${this._page === 'C★H★E★K★A★V★O'}"></u-ads>
        <u-ideas class="page" ?active="${this._page === 'Z★A★P★I★L★I'}"></u-ideas>
        <u-claims class="page" ?active="${this._page === 'C★H★O★M★U'}"></u-claims>
        <u-sale class="page" ?active="${this._page === 'C★H★O★P★O★C★H★O★M'}"></u-sale>
        <u-rides class="page" ?active="${this._page === 'P★O★E★D★U'}"></u-rides>
        <u-anonymous class="page" ?active="${this._page === 'U★D★O★L★I'}"></u-anonymous>
      </main>
        
      <u-404 ?active="${this._page === '404'}"></u-404>
    `;
  }

  static get properties() {
    return {
      appTitle: { type: String },
      pageTitle: { type: String },
      _page: { type: String }
    };
  }

  constructor() {
    super();
    this.appTitle = UApp.getAppTitle();
  }

  firstRendered() {
    installRouter((location) => {
      store.dispatch(navigate(window.decodeURIComponent(location.pathname)));
    });
  }

  _stateChanged(state) {
    this._page = state.app.page;
    this.pageTitle = state.app.pageTitle;

    if (window.opener && this._page === 'success') {
      window.opener.location.reload();
      window.close();
    }
  }

  get _isPageActive() {
    return (this._page !== 'login' && this._page !== '404' && this._page !== '/');
  }

  static getAppTitle() {
    let items = ['Уруссы', 'Уссурийск', 'Уруссняк', 'В Уруссах', 'С Уруссов'];
    return items[Math.floor(Math.random()*items.length)];
  }
}

window.customElements.define('u-app', UApp);
