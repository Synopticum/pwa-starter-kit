import { html, LitElement } from 'lit-element';
import { SharedStyles } from '../../shared-styles.js';

class UDotTooltip extends LitElement {

  static get properties() {
    return {
      x: {
        type: Number
      },
      y: {
        type: Number
      },
      origin: {
        type: String
      }
    };
  }

  render() {
    return html`
      ${SharedStyles}
      <style>
        :host {
            position: fixed;
            left: ${this.x}px;
            top: ${this.y}px;
            min-width: 300px;
            min-height: 150px;
            background-color: #ffffff;
            z-index: 200;
            border: 1px solid blue;
            transform: scale(1);
            transition: transform .3s;
            transform-origin: ${this.origin};
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
        }
      </style>
      
      <div class="object">
        <slot></slot>
      </div> 
    `
  }
}

window.customElements.define('u-dot-tooltip', UDotTooltip);
