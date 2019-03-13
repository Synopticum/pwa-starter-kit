import {html, LitElement} from 'lit-element';

export class UTextbox extends LitElement {

    static get properties() {
        return {
            id: {
                type: String,
                attribute: 'id'
            },
            value: {
                type: String,
                attribute: 'value'
            },
            placeholder: {
                type: String,
                attribute: 'placeholder'
            },
            required: {
                type: Boolean,
                attribute: 'required'
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
          
              :host {
                display: inline-block;
              }
          
              input {
                width: 100%;
                padding: 5px 10px;
                font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
                font-size: 18px;
                background-color: #f9f9f9;
                border: 1px dashed #ccc;
                outline: none;
              }
            
              input:focus {
                border-color: #ccc;
                border-style: dashed;
              }
            
              input::-webkit-input-placeholder {
                font-style: italic;
              }
            
              input::-moz-placeholder {
                font-style: italic;
              }
              
              input.is-updating {
                user-select: none;
                /*background-color: #ff0000;*/
              }
          </style>
          
          <div class="menu">
            <input 
                type="text" 
                id="${this.id}"
                class="${this.isUpdating ? 'is-updating' : ''}"
                value="${this.value}" 
                @keyup="${this._update}"
                placeholder="${this.placeholder}"
                ?disabled="${this.disabled}"
                ?required="${this.required}"
                autocomplete="off">
          </div>
    `;
    }

    _update(e) {
        this.value = e.currentTarget.value;
    }
}

window.customElements.define('u-textbox', UTextbox);