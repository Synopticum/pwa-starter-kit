import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {pieceOfState} from "./UNav.reducer";
import props from './UNav.props';
import styles from './UNav.styles';
import {isAnonymous} from "../u-app/UApp.helpers";
import './u-nav-button/UNavButton';
import './u-nav-search/UNavSearch';
import './u-nav-stats/UNavStats';
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
            <div class="buttons">
                <u-nav-button 
                    type="search" 
                    description="Поиск на карте" 
                    @click="${this.toggleSearch}"
                    ?active="${this.isSearchVisible}">
                        ${this.isSearchVisible ? html`<u-nav-search></u-nav-search>` : ''}
                </u-nav-button>
                
                <u-nav-button 
                    type="stats" 
                    description="Статистика"
                    @click="${this.toggleStats}"
                    ?active="${this.isStatsVisible}">
                        ${this.isStatsVisible ? html`<u-nav-stats></u-nav-stats>` : ''}
                </u-nav-button>
            </div>
          
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
        this.isStatsVisible = true;
    }

    /*
        List of custom component's methods
        Any other methods
    */
    toggleSearch() {
        this.isStatsVisible = false;
        this.isSearchVisible = !this.isSearchVisible;
    }

    toggleStats() {
        this.isSearchVisible = false;
        this.isStatsVisible = !this.isStatsVisible;
    }
}

window.customElements.define('u-nav', UNav);