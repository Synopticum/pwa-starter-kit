import {html, LitElement} from 'lit-element/lit-element';
import props from './UTextButton.props';
import styles from './UTextButton.styles';

export class UTextButton extends LitElement {
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
          
          <div class="u-text-button">
            <button class="button delete-image"
                    ?disabled="${this.disabled}"><slot></slot></button>
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
        this.$container = this.shadowRoot.querySelector('.u-text-button');
    }

    _setListeners() {
        // this.addEventListener('something-happened', this.somethingHappened);
    }

    /*
        List of custom component's methods
        Any other methods
    */
    handleClick(e) {

    }

    somethingHappened() {
        // Use code below to trigger this method from the outside:
        //
        // this.dispatchEvent(new CustomEvent('something-happened', { detail: 'some payload', composed: true }));
        //
    }
}

window.customElements.define('u-text-button', UTextButton);