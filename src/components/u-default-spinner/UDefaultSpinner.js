import {html, LitElement} from 'lit-element/lit-element';
import styles from './UDefaultSpinner.styles';

export class UDefaultSpinner extends LitElement {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return {}
    }

    static get styles() {
        return styles;
    }

    render() {
        return html`
          <div class="default-spinner">
            <div class="default-spinner__circle"></div>
            <div class="default-spinner__circle"></div>
            <div class="default-spinner__circle"></div>
            <div class="default-spinner__circle"></div>
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

    }

    /*
        List of custom component's methods
        Any other methods
    */
}

window.customElements.define('u-default-spinner', UDefaultSpinner);