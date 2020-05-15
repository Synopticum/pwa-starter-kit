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
            'thumbnail--gold': this.type === 'gold',
            'thumbnail--regular': this.type === 'regular'
        };

        return html`
      <style>
        :host {
          ${this._calculateStyle(this.position, this.origin, 20)};
        }
      </style>
      
      <div class="u-tooltip">
        ${this.instanceType === 'object' ? html`
          <div class="object-tooltip">${this.title}</div>
        ` : ''}
        
        ${this.instanceType === 'path' ? html`
          <div class="path-tooltip">${this.title}</div>
        ` : ''}
        
        ${this.instanceType === 'dot' ? html`
            <img src="${this.thumbnail}" width="120" height="120" alt="" class="${classMap(thumbnailClasses)}" style="display: none">
            <div class="dot-tooltip">
            
            </div>
        ` : ''}
      </div> 
    `
    }

    /*
        List of custom component's methods
        Any other methods
    */

    _calculateStyle(position, origin, offset) {
        const { top, right, bottom, left } = position;

        switch (origin) {
            case 'top left':
                return `top: ${top + offset}px; left: ${left + offset}px;`;

            case 'top right':
                return `top: ${top + offset}px; right: ${right + offset}px;`;

            case 'bottom left':
                return `bottom: ${bottom + offset}px; left: ${left + offset}px;`;

            case 'bottom right':
                return `bottom: ${bottom + offset}px; right: ${right + offset}px;`;
        }
    }
}

window.customElements.define('u-tooltip', UTooltip);
