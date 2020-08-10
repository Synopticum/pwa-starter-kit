import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import props from './UTextbox.props';
import styles from './UTextbox.styles';

export class UTextbox extends LitElement {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    constructor() {
        super();
        this.addEventListener('update', this.valueChanged);
        this.addEventListener('reset', this.valueReset);
    }

    static get properties() {
        return props;
    }

    static get styles() {
        return styles;
    }

    render() {
        let textboxClasses = {
            'textbox': true,
            'textbox--is-updating': this.isFetching || this.isUpdating
        };

        const placeholder = this.placeholder && this.placeholder !== 'undefined' ? this.placeholder : '';
        const value = this.value && this.value !== 'undefined' ? this.value : '';

        return html`
          <div class="u-textbox">
              <div class="${classMap(textboxClasses)}">
                <input 
                    type="text" 
                    id="textbox__${this.id}"
                    class="textbox__element"
                    value="${value}" 
                    @keyup="${this.valueChanged}"
                    placeholder="${placeholder}"
                    ?disabled="${this.disabled || this.isFetching || this.isUpdating}"
                    ?required="${this.required}"
                    autocomplete="off">
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
        this.$textarea = this.shadowRoot.querySelector(`#textbox__${this.id}`);
    }

    _setListeners() {

    }

    /*
        List of custom component's methods
        Any other methods
    */
    valueChanged(e) {
        this.value = e.currentTarget.value ? e.currentTarget.value : '';
    }

    valueReset() {
        this.value = '';
        this.$textarea.value = '';
    }
}

window.customElements.define('u-textbox', UTextbox);