import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../../store';
import {connect} from 'pwa-helpers';
import {fetchAddresses} from './UChartStreets.actions';
import {chartStreets} from "./UChartStreets.reducer";
import props from './UChartStreets.props';
import styles from './UChartStreets.styles';

store.addReducers({chartStreets});

export class UChartStreets extends connect(store)(LitElement) {
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
          <div class="u-chart-streets">
            <div class="chart">
                <div class="chart__title">
                    <div class="chart__title-text">Количество домов на улицах:</div>
                    <div class="chart__title-back" @click="${this.back}"></div>
                </div>
                <div class="chart__graphic">
                    <div class="streets"></div>
                </div>
            </div>
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        const addresses = state.chartStreets;
        if (addresses !== this._addresses) this.renderAddressesChart(addresses);
        this._addresses = state.chartStreets;
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
        this.$container = this.shadowRoot.querySelector('.u-smart-template');
        this.$chart = this.shadowRoot.querySelector('.chart__graphic .streets');
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
    renderAddressesChart(addresses) {
        if (addresses) {
            const streets = d3.nest()
                .key(address => address.street)
                .entries(addresses);

            streets.sort((a,b) => b.values.length - a.values.length);

            const max = d3.max(streets, street => street.values.length);
            const yScale = d3.scaleLinear().domain([0, max]).range([3,100]);
            const ybRamp = d3.scaleLinear().interpolate(d3.interpolateHcl).domain([0, max]).range(['#315386', '#933735']);

            const g = d3.select(this.$chart)
                .html('')
                .selectAll('.street')
                .data(streets, d => d.id)
                .enter()
                .append('div')
                .attr('class', 'street')
                .style('width', d => `calc(${parseFloat(yScale(d.values.length)).toFixed(2)}%)`);

            g.append('div')
                .attr('class', 'street__label')
                .style('background-color', d => ybRamp(d.values.length))
                .text(d => d.values.length);

            g.append('div')
                .attr('class', 'street__name')
                .text(d => d.key);
        }
    }

    back() {
        this.dispatchEvent(new CustomEvent('u-nav-stats::clear', {
            composed: true,
            bubbles: true
        }));
    }
}

window.customElements.define('u-chart-streets', UChartStreets);