import {html, LitElement} from 'lit-element';

export class UTextarea extends LitElement {

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
          
              .textarea__element {
                width: 100%;
                font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
                border: 1px dashed #ccc;
                background-color: #f9f9f9;
                font-size: 14px;
                padding: 10px;
                resize: none;
                outline: none;
              }
            
              .textarea__element:focus {
                border-color: #ccc;
                border-style: dashed;
              }
            
              .textarea__element::-webkit-input-placeholder {
                font-style: italic;
              }
            
              .textarea__element::-moz-placeholder {
                font-style: italic;
              }
              
              .textarea.textarea--is-updating .textarea__element {
                user-select: none;
                /*background-color: #ff0000;*/
              }
              
              .textarea__element.textarea__element--default {
                
              }
          </style>
          
          <div class="textarea textarea--${this.type} ${this.isUpdating ? 'textarea--is-updating' : ''}">
            <textarea
                class="textarea__element"
                id="${this.id}" 
                placeholder="${this.placeholder}"
                ?disabled="${this.disabled}"
                ?required="${this.required}">${this.value}</textarea>
          </div>
    `;
    }
}

window.customElements.define('u-textarea', UTextarea);