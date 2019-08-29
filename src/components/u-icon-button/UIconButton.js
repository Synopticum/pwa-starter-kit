import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import props from './UIconButton.props';
import styles from './UIconButton.styles';

export class UIconButton extends LitElement {
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
        let iconButtonClasses = {
            'icon-button': true,
            [`icon-button--${this.icon}`]: true
        };

        return html`        
          <div class="u-icon-button">
            <button class="${classMap(iconButtonClasses)}"></button>
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

window.customElements.define('u-icon-button', UIconButton);