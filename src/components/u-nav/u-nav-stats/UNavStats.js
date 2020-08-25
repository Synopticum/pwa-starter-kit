import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../store';
import {connect} from 'pwa-helpers';
import {stats} from "./UNavStats.reducer";
import props from './UNavStats.props';
import styles from './UNavStats.styles';
import './u-chart-streets/UChartStreets';
import './u-chart-photos/UChartPhotos';

store.addReducers({stats});

export class UNavStats extends connect(store)(LitElement) {
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
          <div class="u-nav-stats">
            <div class="wrapper">
                ${this.isNavVisible ? this.renderNav() : ''}
                
                <div class="chart-area"></div>
            </div>
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {

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

    }

    _setReferences() {
        this.$container = this.shadowRoot.querySelector('.u-nav-stats');
        this.$wrapper = this.shadowRoot.querySelector('.wrapper');
        this.$chartArea = this.shadowRoot.querySelector('.chart-area');
    }

    _setListeners() {
        this.addEventListener('click', e => e.stopPropagation());
        this.addEventListener('u-nav-stats::clear', this.clear);
    }

    _setDefaults() {
        this.isNavVisible = true;
    }

    /*
        List of custom component's methods
        Any other methods
    */
    renderNav() {
        return html`
            <ul class="nav">
                <li class="nav__button" @click="${() => this.showChart('streets')}">
                    <span class="nav__button-title">Улицы, по количеству домов на них</span>
                </li>
                <li class="nav__button" @click="${() => this.showChart('photos')}">
                    <span class="nav__button-title">Дома, по наличию фото</span>
                </li>
            </ul>
        `;
    }

    showChart(name) {
        this.isNavVisible = false;
        this.$chartArea.innerHTML = '';
        this.$chartArea.appendChild(document.createElement(`u-chart-${name}`));
    }

    clear() {
        this.isNavVisible = true;
        this.$chartArea.innerHTML = '';
    }
}

window.customElements.define('u-nav-stats', UNavStats);