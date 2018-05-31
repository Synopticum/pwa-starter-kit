import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';

class UObjectTooltip extends LitElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <style>
        :host {
            position: fixed;
            width: 100px;
            height: 100px;
            background-color: #ffffff;
            z-index: 300;
            border: 1px solid blue;
        }
      </style>
      
      <div class="object">
        <slot></slot>
      </div> 
    `
  }
}

window.customElements.define('u-object-tooltip', UObjectTooltip);
