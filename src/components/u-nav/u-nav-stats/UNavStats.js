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
                <div class="streets">
                    <div class="streets__title">Улицы по количеству домов:</div>
                    <div class="streets__graphic">
                        <svg width="100%"></svg>
                    </div>
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
        const addresses = state.stats.addresses;
        if (addresses !== this._addresses) this.renderAddressesChart(addresses);
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
        this.$streetsSVG = this.shadowRoot.querySelector('.streets svg');
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
            const yScale = d3.scaleLinear().domain([0, max]).range([0,100]);

            d3.select(this.$streetsSVG)
                .html('')
                .selectAll('rect')
                .data(streets)
                .enter()
                .append('rect')
                .attr('width', d => `${parseFloat(yScale(d.values.length)).toFixed(2)}%`)
                .attr('height', 11)
                .style('fill', '#111')
                .style('stroke', '#fff')
                .style('stroke-width', '2px')
                .attr('y', (d, i) => i*11);

            // auto resize svg height
            if (this.$streetsSVG) this.$streetsSVG.style.height = `${this.$streetsSVG.getBBox().height}px`;
        }
    }
}

window.customElements.define('u-nav-stats', UNavStats);