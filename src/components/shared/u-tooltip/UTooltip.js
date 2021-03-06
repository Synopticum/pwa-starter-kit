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
        
        :host(.tooltip--top-left) .content {
            top: 0; 
            left: calc(100% + 5px);
        }
        
        
        :host(.tooltip--top-right) {
            top: ${top}px; 
            right: ${right}px;
        }
        
        :host(.tooltip--top-right) .content {
            top: 0; 
            right: calc(100% + 5px);
        }
        
        
        :host(.tooltip--bottom-left) {
            bottom: ${bottom}px; 
            left: ${left}px;
        }
        
        :host(.tooltip--bottom-left) .content {
            bottom: 0; 
            left: calc(100% + 5px);
        }
        
        
        :host(.tooltip--bottom-right) {
            bottom: ${bottom}px; 
            right: ${right}px;
        }
        
        :host(.tooltip--bottom-right) .content {
            bottom: 0; 
            right: calc(100% + 5px);
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
            return html`<div class="title">Терра инкогнита</div>`;
        }
    }

    getAddress() {
        return html`<div class="title">${this.street}, ${this.house}</div>`;
    }

    getTitle() {
        if (this.title && this.shortDescription) {
            return html`
                <div class="title">${this.title}</div><br>
                <div class="short-description">${this.shortDescription}</div>
            `;
        } else if (this.title) {
            return html`<div class="title">${this.title}</div>`;
        } else {
            return '';
        }
    }

    showDot() {
        const [lat, lng] = this.coordinates;
        const zoom = new URLSearchParams(location.search).get('zoom');

        this.dispatchEvent(new CustomEvent('u-tooltip::show-dot', {
            detail: {
                id: this.instanceId,
                coordinates: { lat, lng },
                zoom
            },
            composed: true,
            bubbles: true
        }));
    }

    renderContent() {
        switch (this.instanceType) {
            case 'object':
                return html`
                    <div class="image">
                        <img 
                            src="${this.thumbnail ? this.thumbnail : '/static/images/components/shared/u-tooltip/no-image.svg'}" 
                            width="90" 
                            height="90" 
                            alt="" 
                            class="thumbnail"
                            @load="${e => this.thumbnail ? e.target.src = this.thumbnail : false }">
                    </div>
                        
                    <div class="content">
                        ${this.getObjectTitle()}
                    </div>
                `;

            case 'dot':
                return html`
                    <div class="image">
                        <img 
                            src="${this.thumbnail ? this.thumbnail : '/static/images/components/shared/u-tooltip/no-image.svg'}" 
                            width="90" 
                            height="90" 
                            alt="" 
                            class="thumbnail"
                            @click="${this.showDot}"
                            @load="${e => this.thumbnail ? e.target.src = this.thumbnail : false }">
                    </div>
                        
                    <div class="content">
                        ${this.getTitle()}
                    </div>
                `;
        }
    }
}

window.customElements.define('u-tooltip', UTooltip);
