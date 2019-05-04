import {html, LitElement} from 'lit-element/lit-element';

export class UTextbox extends LitElement {

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
          
              .textbox__element {
                width: 100%;
                padding: 5px 10px;
                font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
                font-size: 18px;
                background-color: #f9f9f9;
                border: 1px dashed #ccc;
                outline: none;
              }
            
              .textbox__element:focus {
                border-color: #ccc;
                border-style: dashed;
              }
            
              .textbox__element::-webkit-input-placeholder {
                font-style: italic;
              }
            
              .textbox__element::-moz-placeholder {
                font-style: italic;
              }
              
              .textbox.textbox--is-updating .textbox__element {
                background-image: 
                 repeating-linear-gradient(
                  -45deg,
                   #eaeaea,
                   #eaeaea 11px,
                   #fff 10px,
                   #fff 20px
                 );
                background-size: 28px 28px;
                animation: move .5s linear infinite;
              }
              
              @keyframes move {
                0% {
                  background-position: 0 0;
                }
                100% {
                  background-position: 28px 0;
                }
              }
              
              .textbox__element.textbox__element--default {
                
              }
          </style>
          
          <div class="textbox ${this.isUpdating ? 'textbox--is-updating' : ''}">
            <input 
                type="text" 
                id="${this.id}"
                class="textbox__element"
                value="${this.value}" 
                @keyup="${this._update}"
                placeholder="${this.placeholder}"
                ?disabled="${this.disabled || this.isUpdating}"
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