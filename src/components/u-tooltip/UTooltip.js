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

    let textAlign = this.origin === 'top left' || this.origin === 'bottom left' ? 'left' : 'right';
    let padding = this.origin === 'top left' || this.origin === 'bottom left' ? '0 0 0 15px' : '0 10px 0 0';

    return html`
      <style>
        :host {
          left: ${this.x}px;
          top: ${this.y}px;
          transform-origin: ${this.origin};
          text-align: ${textAlign};
          padding: ${padding}
        }
      </style>
      
      <div class="u-tooltip">
        ${this.instanceType === 'object' ? html`
          <div class="object-tooltip">${this.title}</div>
        ` : ''}
        
        ${this.instanceType === 'path' ? html`
          <div class="path-tooltip">${this.title}</div>
        ` : ''}
        
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
