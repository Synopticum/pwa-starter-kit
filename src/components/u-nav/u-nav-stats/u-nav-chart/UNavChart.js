import {html, LitElement} from 'lit-element/lit-element';
import props from './UNavChart.props';
import styles from './UNavChart.styles';

export class UNavChart extends LitElement {
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
      <style>
        :host {
        
        }
      </style>
      
      <div class="u-nav-chart">
            <div class="chart">
                <div class="chart__title">
                    <div class="chart__title-text">${this.title}</div>
                    <div class="chart__title-back" @click="${this.back}"></div>
                </div>
                <div class="chart__graphic">
                    <slot></slot>
                </div>
            </div>
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
        this.$container = this.shadowRoot.querySelector('.u-dumb-template');
    }

    _setListeners() {
        this.addEventListener('something-happened', this.somethingHappened);
    }

    /*
        List of custom component's methods
        Any other methods
    */
    back() {
        this.dispatchEvent(new CustomEvent('u-nav-stats::clear', {
            composed: true,
            bubbles: true
        }));
    }
}

window.customElements.define('u-nav-chart', UNavChart);