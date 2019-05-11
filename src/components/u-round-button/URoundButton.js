import {html, LitElement} from 'lit-element/lit-element';

export class URoundButton extends LitElement {
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
            
            .button {
                display: inline-block;
            }
        
            .button__element {
                cursor: pointer;
                width: 30px;
                height: 30px;
                border: 0;
                outline: none;
                background-repeat: no-repeat;
                background-position: 50% 50%;
                background-color: #fff;
                border-radius: 50%;
                transition: opacity .3s;
            }
            
            .button__element:disabled {
                cursor: not-allowed;
                opacity: .3;
            }
            
            /* types */
            .button.button--submit .button__element {
                background-image: url("static/images/button-icons/submit.svg");
            }
            
            .button.button--close .button__element {
                background-image: url("static/images/button-icons/close.svg");
            }
            
            .button.button--x .button__element {
                background-image: url("static/images/button-icons/x.svg");
            }
            
            .button.button--remove .button__element {
                background-image: url("static/images/button-icons/remove.svg");
            }
          </style>
          
          <div class="button button--${this.type} ${this.isUpdating ? 'button--is-updating' : ''}">
            <button 
                type="button"
                id="${this.id}"
                class="button__element"
                title="${this.title ? this.title : ''}"
                ?disabled="${this.disabled}"></button>
          </div>
    `;
    }
}

window.customElements.define('u-round-button', URoundButton);