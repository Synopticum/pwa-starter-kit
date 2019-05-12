import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';
import { store } from '../../store.js';
import {navigate, fetchUserInfo, enableAnonymousMode} from './UApp.actions';

class UApp extends connect(store)(LitElement) {
  /*
      List of required methods
      Needed for initialization, rendering, fetching and setting default values
  */
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

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this._setDefaults();
  }

  stateChanged(state) {
    this._page = state.app.page;
    this.pageTitle = state.app.pageTitle;

    if (window.opener && this._page === 'success') {
      window.opener.location.reload();
      window.close();
    }
  }

  firstUpdated() {
    this._init();
  }

  _init() {
    this._setStore();
    this._setReferences();
    this._setListeners();
  }

  _setStore() {
    this._initUser();
    this._initRouter();
  }

  _setReferences() {

  }

  _setListeners() {

  }

  _setDefaults() {

  }

  /*
      List of custom component's methods
      Any other methods
  */
  _initUser() {
    if (localStorage.token === 'anonymous') {
      store.dispatch(enableAnonymousMode());
    } else {
      store.dispatch(fetchUserInfo());
    }
  }

  _initRouter() {
    installRouter(location => {
      store.dispatch(navigate(window.decodeURIComponent(location.pathname)));
    });
  }
}

window.customElements.define('u-app', UApp);
