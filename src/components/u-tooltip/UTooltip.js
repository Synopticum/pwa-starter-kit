import {html, LitElement} from 'lit-element/lit-element';
import props from './UTooltip.props';
import styles from './UTooltip.styles';

class UTooltip extends LitElement {
  /*
      List of required methods
      Needed for initialization, rendering, fetching and setting default values
  */
  static get properties() {
    return props;
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
      <style>
        :host {
          left: ${this.x}px;
          top: ${this.y}px;
          transform-origin: ${this.origin};
          background: url(${this.thumbnail}) no-repeat 50% 50%;
        }
      </style>
      
      <div class="u-tooltip">
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
