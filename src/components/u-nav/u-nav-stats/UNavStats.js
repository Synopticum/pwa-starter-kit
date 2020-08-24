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
                    <div class="streets__title">
                        <div class="streets__title-text">Улицы по количеству домов на них</div>
                    </div>
                    <div class="streets__graphic">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%"></svg>
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
            const ybRamp = d3.scaleLinear().interpolate(d3.interpolateHcl).domain([0, max]).range(['#315386', '#933735']);

            const g = d3.select(this.$streetsSVG)
                .html('')
                .selectAll('g')
                .data(streets, d => d.id)
                .enter()
                .append('g');

            g.append('rect')
                // .transition()
                // .delay((d,i) => i*50)
                // .duration(500)
                .attr('class', 'line')
                .attr('width', d => `calc(${parseFloat(yScale(d.values.length)).toFixed(2)}%)`)
                .attr('x', '0')
                .attr('y', (d, i) => i*12)
                .attr('fill', d => ybRamp(d.values.length))
                .on('click', function (a,b,c) { debugger; });

            g.append('text')
                .attr('class', 'label')
                .attr('x', '5')
                .attr('y', (d, i) => i*12+9)
                .text(d => d.values.length)

            // auto resize svg height
            if (this.$streetsSVG) this.$streetsSVG.style.height = `${this.$streetsSVG.getBBox().height}px`;
        }
    }
}

window.customElements.define('u-nav-stats', UNavStats);