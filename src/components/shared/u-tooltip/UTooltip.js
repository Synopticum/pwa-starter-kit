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
        const { top, right, bottom, left } = this.position;

        return html`
      <style>
        :host {
        
        }
        
        :host(.tooltip--top-left) {
            top: ${top}px; 
            left: ${left}px;
        }
        
        :host(.tooltip--top-right) {
            top: ${top}px; 
            right: ${right}px;
        }
        
        :host(.tooltip--bottom-left) {
            bottom: ${bottom}px; 
            left: ${left}px;
        }
        
        :host(.tooltip--bottom-right) {
            bottom: ${bottom}px; 
            right: ${right}px;
        }
      </style>
      
      <div class="u-tooltip">
        ${this.instanceType === 'object' ? html`
            <div class="tooltip-wrapper">
                <div class="content">
                    <div class="title">${this.getAddress()}</div>
                </div>
            </div>
        ` : ''}
        
        ${this.instanceType === 'path' ? html`
          <div class="path-tooltip">${this.title}</div>
        ` : ''}
        
        ${this.instanceType === 'dot' ? html`
            <div class="tooltip-wrapper">
                <img 
                    src="${this.thumbnail}" 
                    width="120" 
                    height="120" 
                    alt="" 
                    class="thumbnail"
                    @click="${this.showDot}">
                
                <!-- <div class="content">
                    <div class="title">${this.title}</div>
                    <div class="description">${this.shortDescription}</div>
                </div> -->
            </div>
        ` : ''}
      </div> 
    `
    }

    /*
        List of custom component's methods
        Any other methods
    */
    getAddress() {
        return this.street && this.house ? `${this.street}, ${this.house}` : 'Терра инкогнита';
    }

    showDot() {
        this.dispatchEvent(new CustomEvent('show-dot', { detail: this.instanceId, composed: true, bubbles: true }));
    }
}

window.customElements.define('u-tooltip', UTooltip);
