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
      </style>
      
      <u-map></u-map>
        
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
