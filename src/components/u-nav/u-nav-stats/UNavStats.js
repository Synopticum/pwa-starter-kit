import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../store';
import {connect} from 'pwa-helpers';
import {fetchAddresses, toggle} from './UNavStats.actions';
import {stats} from "./UNavStats.reducer";
import props from './UNavStats.props';
import styles from './UNavStats.styles';

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
            </div>
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        if (state.stats.addresses !== this._addresses) this.renderAddressesChart();
        this._addresses = state.stats.addresses;
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
        store.dispatch(fetchAddresses());
    }

    _setReferences() {
        this.$container = this.shadowRoot.querySelector('.u-nav-stats');
        this.$wrapper = this.shadowRoot.querySelector('.wrapper');
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
    renderAddressesChart() {
        d3.select(this.$wrapper)
            .html('')
            .append('div')
            .style('border', '1px solid red')
            .style('padding', '15px')
            .html('Test');
    }
}

window.customElements.define('u-nav-stats', UNavStats);