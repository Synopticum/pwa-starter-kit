import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../../../store';
import {connect} from 'pwa-helpers';
import {fetchData} from './UNavChartSummer.actions';
import {chartSummer} from "./UNavChartSummer.reducer";
import props from './UNavChartSummer.props';
import styles from './UNavChartSummer.styles';

store.addReducers({chartSummer});

const DAYS = [10,11,12,13,14,15,16];

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
        const preparedData = this._prepareData(data);

        const xScale = d3.scaleTime()
            .domain([new Date('1979-01-01 00:00:00 +0000 UTC'), new Date('2021-01-01 00:00:00 +0000 UTC')])
            .range([0,390]);
        const yScale = d3.scaleLinear()
            .domain([-60,60])
            .range([390,0]);

        for (const [index, data] of preparedData.entries()) {
            // this._renderLine(xScale, yScale, data);
            this._renderArea(xScale, yScale, data, index);
        }

        this._renderAxes(xScale, yScale);
    }

    _renderCircles(xScale, yScale, data) {
        d3.select(this.$svg)
            .selectAll('circle')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'circle')
            .attr('cx', d => xScale(new Date(d.dt_iso)))
            .attr('cy', d => yScale(d.main.temp))
            .attr('r', 2)
            .style('fill', '#111')
    }

    _renderLine(xScale, yScale, data) {
        const line = d3.line()
            .curve(d3.curveCardinal)
            .x(d => xScale(new Date(d.dt_iso)))
            .y(d => yScale(d.main.temp));

        d3.select(this.$svg)
            .append('path')
            .attr('d', line(data))
            .attr('class', 'line');
    }

    _renderArea(xScale, yScale, data, index) {
        const fillScale = d3.scaleLinear()
            .domain([0,6])
            .range(['lightgray', 'black']);

        const area = d3.area()
            .curve(d3.curveCardinal)
            .x(d => xScale(new Date(d.dt_iso)))
            .y1(d => yScale(d.main.temp))
            .y0(d => yScale(-d.main.temp));

        d3.select(this.$svg)
            .append('path')
            .attr('class', 'area')
            .attr('fill', fillScale(index))
            .attr('d', area(data));
    }

    _renderAxes(xScale, yScale) {
        const xAxis = d3.axisBottom(xScale);
        d3.select(this.$svg)
            .append('g')
            .attr('id', 'xAxisG')
            .call(xAxis);

        const yAxis = d3.axisRight(yScale);
        d3.select(this.$svg)
            .append('g')
            .attr('id', 'yAxisG')
            .call(yAxis);
    }

    _prepareData(data) {
        return DAYS.map(day => data.filter(d => this.filterByDay(d, day)).sort(this.sortByDate));
    }

    filterByDay(d, day) {
        return new Date(d.dt_iso).getDate() === day;
    }

    sortByDate(a,b) {
        return new Date(a.dt_iso) - new Date(b.dt_iso);
    }
}

window.customElements.define('u-nav-chart-summer', UNavChartSummer);