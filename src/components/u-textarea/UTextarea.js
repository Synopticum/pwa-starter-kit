import {html, LitElement} from 'lit-element/lit-element';
import props from './UTextarea.props';
import styles from './UTextarea.styles';

export class UTextarea extends LitElement {
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

    constructor() {
        super();
        this.addEventListener('update', this.valueChanged);
        this.addEventListener('reset', this.valueReset);
    }

    render() {
        return html`
          <div class="u-textarea">
              <div class="textarea textarea--${this.type} ${this.isUpdating ? 'textarea--is-updating' : ''}">
                <textarea
                    class="textarea__element"
                    id="textarea__${this.id}" 
                    placeholder="${this.placeholder}"
                    @keyup="${this.valueChanged}"
                    ?disabled="${this.disabled}"
                    ?required="${this.required}">${this.value}</textarea>
              </div>
          </div>
    `;
    }

    firstUpdated() {
        this._init();
        this._setReferences();
    }

    _init() {
        this._setReferences();
        this._setListeners();
    }

    _setReferences() {
        this.$textarea = this.shadowRoot.querySelector(`#textarea__${this.id}`);
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

window.customElements.define('u-textarea', UTextarea);