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
        <div class="tooltip-wrapper">
            ${this.renderContent()}
        </div>
      </div> 
    `
    }

    /*
        List of custom component's methods
        Any other methods
    */
    getObjectTitle() {
        if (this.street && this.house) {
            return this.getAddress();
        } else if (this.title) {
            return this.getTitle();
        } else {
            return 'Терра инкогнита';
        }
    }

    getAddress() {
        return html`<div class="title">${this.street}, ${this.house}</div>`;
    }

    getTitle() {
        if (this.title && this.shortDescription) {
            return html`
                <div class="title">${this.title}</div>
                <div class="short-description">${this.shortDescription}</div>
            `;
        } else if (this.title) {
            return html`<div class="title">${this.title}</div>`;
        } else {
            return '';
        }
    }

    showDot() {
        this.dispatchEvent(new CustomEvent('u-tooltip::show-dot', { detail: this.instanceId, composed: true, bubbles: true }));
    }

    showObject() {
        this.dispatchEvent(new CustomEvent('u-tooltip::show-object', { detail: this.instanceId, composed: true, bubbles: true }));
    }

    renderContent() {
        switch (this.instanceType) {
            case 'object':
                return html`
                    <img 
                        src="${this.thumbnail ? this.thumbnail : '/static/images/tooltip/unknown.png'}" 
                        width="90" 
                        height="90" 
                        alt="" 
                        class="thumbnail"
                        @click="${this.showObject}">
                        
                    <div class="content">
                        <div class="title">${this.getObjectTitle()}</div>
                    </div>
                `;

            case 'dot':
                return html`
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
                `;
        }
    }
}

window.customElements.define('u-tooltip', UTooltip);
