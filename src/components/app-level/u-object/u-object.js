import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';

class UObject extends LitElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <style>
        :host {
            width: 100px;
            height: 100px;
            background-color: #ffffff;
        }
      </style>
      
      <div class="object">
        <slot></slot>
      </div> 
    `
  }
}

window.customElements.define('u-object', UObject);
