import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';

class UObjectInfo extends LitElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <style>
        :host {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            width: 200px;
            height: 200px;
            background-color: #ffffff;
            z-index: 200;
        }
      </style>
      
      <div class="object">
        <slot></slot>
      </div> 
    `
  }
}

window.customElements.define('u-object-info', UObjectInfo);
