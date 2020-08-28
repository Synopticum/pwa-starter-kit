import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../../../store';
import {connect} from 'pwa-helpers';
import {fetchAddresses} from './UNavChartPopulation.actions';
import {chartPopulation} from "./UNavChartPopulation.reducer";
import props from './UNavChartPopulation.props';
import styles from './UNavChartPopulation.styles';

store.addReducers({chartPopulation});

export class UNavChartPopulation extends connect(store)(LitElement) {
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
          <div class="u-nav-chart-population">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" class="chart"></svg>
          </div>
        `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        const population = state.chartPopulation;
        if (population !== this._population) this.renderPopulationChart(population);
        this._population = state.chartPopulation;
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
    renderPopulationChart(population) {
        if (population) {
            const xMax = d3.max(population, item => item.year);
            const yMax = d3.max(population, item => item.value);

            const xScale = d3.scaleLinear().domain([1959,xMax+10]).range([20,380]);
            const yScale = d3.scaleLinear().domain([yMax,0]).range([50,350]);

            this._renderAxes(xScale, yScale);
            this._renderLine(xScale, yScale, population);
            this._renderCircles(xScale, yScale, population);
        }
    }

    _renderCircles(xScale, yScale, data) {
        d3.select(this.$svg)
            .selectAll('circle')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${xScale(d.year)-1}, ${yScale(d.value)-1})`)
            .each(function () {
                d3.select(this)
                    .append('circle')
                    .attr('r', 2);
            });
    }

    _renderAxes(xScale, yScale) {
        const xAxis = d3.axisBottom(xScale).ticks(8).tickSize(380).tickFormat(d3.format('d'));
        d3.select(this.$svg)
            .append('g')
            .attr('id', 'xAxisG')
            .call(xAxis);

        const yAxis = d3.axisRight(yScale).ticks(12).tickSize(350);
        d3.select(this.$svg)
            .append('g')
            .attr('id', 'yAxisG')
            .call(yAxis);
    }

    _renderLine(xScale, yScale, data) {
        const line = d3.line()
            .curve(d3.curveLinear)
            .x(d => xScale(d.year)-1)
            .y(d => yScale(d.value)-1);

        d3.select(this.$svg)
            .append('path')
            .attr('d', line(data))
            .attr('class', 'line');
    }
}

window.customElements.define('u-nav-chart-population', UNavChartPopulation);