import { html, LitElement } from 'lit-element/lit-element';
import props from './UContextMenu.props';
import styles from './UContextMenu.styles';

export class UContextMenu extends LitElement {
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
        }
      </style>
      
      <div class="menu">
        <slot name="context-menu-items"></slot>
      </div>
    `;
  }

  firstUpdated() {
    this._init();
  }

  _init() {
    this._setReferences();
    this._setListeners();
  }

  _setReferences() {

  }

  _setListeners() {

  }

  /*
      List of custom component's methods
      Any other methods
  */
}

window.customElements.define('u-context-menu', UContextMenu);