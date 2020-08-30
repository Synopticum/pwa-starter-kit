import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../../../store';
import {connect} from 'pwa-helpers';
import {fetchData} from './UNavChartSummer.actions';
import {chartSummer} from "./UNavChartSummer.reducer";
import props from './UNavChartSummer.props';
import styles from './UNavChartSummer.styles';

store.addReducers({chartSummer});

export class UNavChartSummer extends connect(store)(LitElement) {
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
          <div class="summer">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" class="chart"></svg>
          </div>
        `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        const data = state.chartSummer;
        if (data !== this._data) this.renderChart(data);
        this._data = state.chartSummer;
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
        store.dispatch(fetchData());
    }

    _setReferences() {
        this.$svg = this.shadowRoot.querySelector('.chart');
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
    renderChart(data) {
        // debugger;
    }
}

window.customElements.define('u-nav-chart-summer', UNavChartSummer);