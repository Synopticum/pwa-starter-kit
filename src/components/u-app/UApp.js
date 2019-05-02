import { LitElement, html } from 'lit-element';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';

import { store } from '../../store.js';
import { navigate, fetchUserInfo } from './UApp.actions';

class UApp extends connect(store)(LitElement) {

  createRenderRoot() {
    return this;
  }

  render() {
    return html`      
      <u-map width="6400"
             height="4000"
             min-zoom="4" 
             max-zoom="5"
             max-bounds="[[5,-180],[122,100]]"
             object-fill-color="#ffc600"
             object-stroke-width="2"></u-map>
        
      <u-404 ?active="${this._page === '404'}"></u-404>
    `;
  }

  static get properties() {
    return {
      pageTitle: {
        type: String,
        attribute: false
      },
      _page: {
        type: String,
        attribute: false
      }
    };
  }

  constructor() {
    super();
  }

  firstUpdated() {
    store.dispatch(fetchUserInfo());
    installRouter(location => store.dispatch(navigate(window.decodeURIComponent(location.pathname))));
  }

  stateChanged(state) {
    this._page = state.app.page;
    this.pageTitle = state.app.pageTitle;

    if (window.opener && this._page === 'success') {
      window.opener.location.reload();
      window.close();
    }
  }
}

window.customElements.define('u-app', UApp);
