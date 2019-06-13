import { html, LitElement } from 'lit-element/lit-element';

class UTooltip extends LitElement {
  /*
      List of required methods
      Needed for initialization, rendering, fetching and setting default values
  */
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
      },

      thumbnail: {
        type: String
      }
    };
  }

  render() {
    return html`
      <style>
        :host {
            position: fixed;
            left: ${this.x}px;
            top: ${this.y}px;
            width: 100px;
            height: 100px;
            z-index: 200;
            border: 3px solid #6E9A32;
            border-radius: 5px;
            transform: scale(1);
            transition: transform .3s;
            transform-origin: ${this.origin};
            background: url(${this.thumbnail}) no-repeat 50% 50%;
            background-size: cover;
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
        }
        
        :host::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            opacity: .3;
            background: linear-gradient(transparent,#000);
        }
      </style>
      
      <div class="item">
        <slot></slot>
      </div> 
    `
  }

  /*
      List of custom component's methods
      Any other methods
  */
}

window.customElements.define('u-tooltip', UTooltip);
