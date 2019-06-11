import {html, LitElement} from 'lit-element/lit-element';

export class UButton extends LitElement {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return {
            id: {
                type: String,
                attribute: 'id'
            },

            type: {
                type: String,
                attribute: 'type'
            },

            title: {
                type: String,
                attribute: 'title'
            },

            disabled: {
                type: Boolean,
                attribute: 'disabled'
            },

            isUpdating: {
                type: Boolean,
                attribute: 'is-updating'
            }
        }
    }

    render() {
        return html`
          <style>
            * { box-sizing: border-box }  
            
            .button .button__element {
                cursor: pointer;
                display: inline-flex;
                border: 0;
                margin: 0;
                padding: 7px 15px 9px 15px;
                border-radius: var(--border-radius);
                background: #666;
                color: #ffffff;
                font-family: 'PT Serif', 'Times New Roman', serif;
                font-size: 16px;
                box-shadow: 2px 2px 2px rgba(0,0,0,.5);
                outline: none;
            }
            
            .button--regular .button__element {
                color: #000000;
                background: linear-gradient(#ffffff, #cccccc);
            }
            .button--regular .button__element:active {
                background: linear-gradient(#cccccc, #ffffff);
            }
            
            .button--danger .button__element {
                background: linear-gradient(#D81116, #971830);
            }
            .button--danger .button__element:active {
                background: linear-gradient(#971830, #D81116);
            }
            
            .button .button__element:disabled {
                cursor: not-allowed;
                opacity: .3;
            }
            
            /* types */
            .button.button--regular .button__element {
            }
            
            .button.button--danger .button__element {
            }
          </style>
          
          <div class="button button--${this.type} ${this.isUpdating ? 'button--is-updating' : ''}">
            <button 
                type="button"
                id="${this.id}"
                class="button__element"
                title="${this.title ? this.title : ''}"
                ?disabled="${this.disabled}"><slot></slot></button>
          </div>
    `;
    }
}

window.customElements.define('u-button', UButton);