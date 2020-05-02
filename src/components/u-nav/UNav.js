import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {fetch, toggle} from './UNav.actions';
import {pieceOfState} from "./UNav.reducer";
import props from './UNav.props';
import styles from './UNav.styles';
import {isAnonymous} from "../u-app/UApp.helpers";
import './u-nav-login/UNavLogin';

store.addReducers({pieceOfState});

export class UNav extends connect(store)(LitElement) {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return props;
    }

    static get styles() {
        return styles;
    }

    render() {
        return html`   
          <div class="u-nav">
            <u-nav-login ?is-anonymous="${isAnonymous(this._user)}" image-url="${this._user.avatar}"></u-nav-login>
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._user = state.app.user;
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
        // store.dispatch(fetch());
    }

    _setReferences() {
        this.$container = this.shadowRoot.querySelector('.u-nav');
    }

    _setListeners() {
        this.addEventListener('click', e => e.stopPropagation());
    }

    _setDefaults() {

    }

    /*
        List of custom component's methods
        Any other methods
    */
}

window.customElements.define('u-nav', UNav);