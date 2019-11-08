import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
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
    let thumbnailClasses = {
      'thumbnail': true,
      'thumbnail--old-and-new': this.type === 'old-and-new',
      'thumbnail--old': this.type === 'old',
      'thumbnail--new': this.type === 'new'
    };

    return html`
      <style>
        :host {
          left: ${this.x}px;
          top: ${this.y}px;
          transform-origin: ${this.origin};
        }
      </style>
      
      <div class="u-tooltip">
        ${this.instanceType === 'object' ? html`object` : ''}
        ${this.instanceType === 'path' ? html`path` : ''}
        ${this.instanceType === 'dot' ? html`<img src="${this.thumbnail}" width="120" height="120" alt="" class="${classMap(thumbnailClasses)}">` : ''}
      </div> 
    `
  }

  /*
      List of custom component's methods
      Any other methods
  */
}

window.customElements.define('u-tooltip', UTooltip);
