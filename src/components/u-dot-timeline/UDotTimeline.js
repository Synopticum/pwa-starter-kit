import { html, LitElement } from 'lit-element/lit-element';
import props from './UDotTimeline.props';
import styles from './UDotTimeline.styles';

export class UDotTimeline extends LitElement {

    constructor() {
        super();
        this._setDefaults();
    }

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
          <div class="u-dot-timeline">
            ${this.images && this.activeDecade ? Object.entries(this.images).map(decade => this.renderDecade(decade)) : ''}
          </div> 
    `;
    }

    firstUpdated() {
        this._init();
    }

    _init() {
        this._setReferences();
        this._setListeners();
    }

    _setReferences() {

    }

    _setListeners() {
        this.addEventListener('something-happened', this.somethingHappened);
    }

    _setDefaults() {
        this.decadeLabels = {
            1940: 'Сороковые',
            1950: 'Пятидесятые',
            1960: 'Шестидесятые',
            1970: 'Семидесятые',
            1980: 'Восьмидесятые',
            1990: 'Девяностые',
            2000: 'Нулевые',
            2010: 'Десятые'
        };
    }

    /*
        List of render methods
     */
    renderDecade(decade) {
        return html`<div class="decade ${decade[0] === this.activeDecade ? 'decade--active' : ''}" @click="${e => this.changeImage(e, decade[0])}">${this.decadeLabels[decade[0]]}</div>`;
    }

    /*
        List of custom component's methods
        Any other methods
    */
    changeImage(e, decade) {
        this.dispatchEvent(new CustomEvent('u-dot-timeline:change-image', { detail: { decade }, composed: true }));
    }
}

window.customElements.define('u-dot-timeline', UDotTimeline);