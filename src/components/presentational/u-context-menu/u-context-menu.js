import { html, LitElement } from 'lit-element';
import { SharedStyles } from '../../shared-styles';

export class UContextMenu extends LitElement {

  static get properties() {
    return {
      x: {
        type: Number
      },
      y: {
        type: Number
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
          min-width: 150px;
          background-color: #fff;
          border-radius: 5px;
          overflow: hidden;
          color: #000;
          z-index: 100;
          transform: scale(1);
          transition: transform .3s;
        }
        
        :host([hidden]) {
          display: block !important;
          transform: scale(0);
        }

        ::slotted(.menu__item) {
          cursor: pointer;
          padding: 5px 10px;
        }
        
        ::slotted(.menu__item:hover) {
          background-color: #eee;
        }
      </style>
      
      <div class="menu">
        <slot name="context-menu-items"></slot>
      </div>
    `;
  }
}

window.customElements.define('u-context-menu', UContextMenu);