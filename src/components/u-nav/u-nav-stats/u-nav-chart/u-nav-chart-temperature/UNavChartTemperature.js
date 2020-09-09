import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../../../store';
import {connect} from 'pwa-helpers';
import {fetchData} from './UNavChartTemperature.actions';
import {chartTemperatureHottest} from "./UNavChartTemperature.reducer";
import props from './UNavChartTemperature.props';
import styles from './UNavChartTemperature.styles';

store.addReducers({chartTemperatureHottest});

export class UNavChartTemperature extends connect(store)(LitElement) {
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
          <div class="u-nav-chart-temperature">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" class="chart"></svg>
          </div>
        `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        const data = state.chartPopulation;
        if (data !== this._data) this.renderChart(data);
        this._data = state.chartPopulation;
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
        store.dispatch(fetchData(this.type));
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
    renderChart(data) {
        if (data) {
            const xScale = d3.scaleTime()
                .domain([new Date('1978-01-01 00:00:00 +0000 UTC'), new Date('2021-01-01 00:00:00 +0000 UTC')])
                .range([0,470]);
            const yScale = d3
                .scaleLinear()
                .domain(this.type === 'hottest' ? [40,20] : [0,-60])
                .range([0,490]);

            this._renderAxes(xScale, yScale);
            this._renderLine(xScale, yScale, data);
            this._renderCircles(xScale, yScale, data);
        }
    }

    _renderAxes(xScale, yScale) {
        const xAxis = d3.axisBottom(xScale).ticks(8).tickSize(480);
        d3.select(this.$svg)
            .append('g')
            .attr('id', 'xAxisG')
            .attr('transform', 'translate(5,0)')
            .call(xAxis);

        const yAxis = d3.axisRight(yScale).ticks(20).tickSize(470);
        d3.select(this.$svg)
            .append('g')
            .attr('id', 'yAxisG')
            .attr('transform', 'translate(0,5)')
            .call(yAxis);
    }

    _renderLine(xScale, yScale, data) {
        const line = d3.line()
            .x(d => xScale(new Date(d.dt_iso)))
            .y(d => yScale(d.main.temp_max));

        d3.select(this.$svg)
            .append('path')
            .attr('d', line(data))
            .attr('class', 'line');
    }

    _renderCircles(xScale, yScale, data) {
        d3.select(this.$svg)
            .selectAll('circle')
            .data(data.reverse())
            .enter()
            .append('g')
            .attr('class', 'group-circle')
            .attr('transform', d => `translate(${xScale(new Date(d.dt_iso))}, ${yScale(d.main.temp_max)})`)
            .each(function (d) {
                d3.select(this)
                    .append('circle')
                    .attr('class', 'group-circle__point')
                    .attr('r', 3);

                d3.select(this)
                    .append('text')
                    .attr('class', 'group-circle__value')
                    .attr('transform', 'translate(-5,-16)')
                    .text(`${d.main.temp_max}° (${new Date(d.dt_iso).getFullYear()})`);


                const SVGRect = this.getBBox();
                d3.select(this)
                    .insert('rect', '.group-circle__value')
                    .attr('class', 'group-circle__background')
                    .attr('x', SVGRect.x-5)
                    .attr('y', SVGRect.y-5)
                    .attr('width', SVGRect.width+10)
                    .attr('height', SVGRect.height-5);
            });
    }
}

window.customElements.define('u-nav-chart-temperature', UNavChartTemperature);