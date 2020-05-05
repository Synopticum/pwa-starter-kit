import {html, LitElement} from 'lit-element/lit-element';
import props from './UMapRange.props';
import styles from './UMapRange.styles';

export class UMapRange extends LitElement {
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
        .range {
            left: ${this.getPosition(this.currentMin)}%;
            right: ${100 - this.getPosition(this.currentMax)}%;
        }
        
        .thumb--left {
            left: ${this.getPosition(this.currentMin)}%;
        }
        
        .thumb--right {
            left: ${this.getPosition(this.currentMax)}%;
        }
        
        .sign--left {
            left: ${this.getPosition(this.currentMin)}%;
        }
        
        .sign--right {
            left: ${this.getPosition(this.currentMax)}%;
        }
      </style>
      
      <div class="u-map-range">
        <div class="wrapper">
            <div class="inverse inverse--left"></div>
            <div class="inverse inverse--right"></div>
            
            <div class="range"></div>
            
            <span class="thumb thumb--left"></span>
            <span class="thumb thumb--right"></span>
            
            <div class="sign sign--left">${this.currentMin}</div>
            <div class="sign sign--right">${this.currentMax}</div>
        </div>
    
        <input type="range" max="${this.max}" value="${this.currentMin}" min="${this.min}" step="1" @input="${this.updateMin}" class="input-min" />
        <input type="range" max="${this.max}" value="${this.currentMax}" min="${this.min}" step="1" @input="${this.updateMax}" class="input-max" />
      </div>
    `;
    }

    updateMin() {
        this.$inputMin.value = Math.min(this.$inputMin.value, this.$inputMax.value - 1);
        const value = (this.$inputMin.value - this.min)/(this.max - this.min) * 100;

        this.$inverseLeft.style.width = `${value}%`;
        this.$range.style.left = `${value}%`;
        this.$thumbLeft.style.left = `${value}%`;
        this.$signLeft.style.left = `${value}%`;
        this.$signLeft.textContent = this.$inputMin.value;
    }

    updateMax() {
        this.$inputMax.value = Math.max(this.$inputMax.value, this.$inputMin.value-(-1));
        const value = (this.$inputMax.value - this.min)/(this.max - this.min) * 100;

        this.$inverseRight.style.width = `${(100-value)}%`;
        this.$range.style.right = `${(100-value)}%`;
        this.$thumbRight.style.left = `${value}%`;
        this.$signRight.style.left = `${value}%`;
        this.$signRight.textContent = this.$inputMax.value;

        this.updateRange(this.$inputMin.value, this.$inputMax.value, (100-value)/100);
    }

    getPosition(value) {
        return (value - 1940)/(2020 - 1940) * 100;
    }

    firstUpdated() {
        this._init();
    }

    _init() {
        this._setReferences();
        this._setListeners();
    }

    _setReferences() {
        this.$inverseLeft = this.shadowRoot.querySelector('.inverse--left');
        this.$inverseRight = this.shadowRoot.querySelector('.inverse--right');

        this.$range = this.shadowRoot.querySelector('.range');

        this.$thumbLeft = this.shadowRoot.querySelector('.thumb--left');
        this.$thumbRight = this.shadowRoot.querySelector('.thumb--right');

        this.$signLeft = this.shadowRoot.querySelector('.sign--left');
        this.$signRight = this.shadowRoot.querySelector('.sign--right');

        this.$inputMin = this.shadowRoot.querySelector('.input-min');
        this.$inputMax = this.shadowRoot.querySelector('.input-max');
    }

    _setListeners() {
        // this.addEventListener('update-range', this.updateRange);
    }

    /*
        List of custom component's methods
        Any other methods
    */
    updateRange(min, max, sepia) {
        this.dispatchEvent(new CustomEvent('update-range', { detail: { range: [min, max], sepia }, composed: true }));
    }
}

window.customElements.define('u-map-range', UMapRange);