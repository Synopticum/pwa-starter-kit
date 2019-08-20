import { html, LitElement } from 'lit-element/lit-element';
import props from './UDumbTemplate.props';
import styles from './UDumbTemplate.styles';

export class UDumbTemplate extends LitElement {
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
      
      <div class="u-dumb-template">
        ${this.myProperty}
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
    somethingHappened() {
        // Use code below to trigger this method from the outside:
        //
        // this.dispatchEvent(new CustomEvent('something-happened', { detail: 'some payload', composed: true }));
        //
    }
}

window.customElements.define('u-dumb-template', UDumbTemplate);