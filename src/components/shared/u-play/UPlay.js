import {html, LitElement} from 'lit-element/lit-element';
import props from './UPlay.props';
import styles from './UPlay.styles';

export class UPlay extends LitElement {
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
        
        }
      </style>
      
      <div class="u-play">
          <audio src="/static/sound${this.src}" loop></audio>
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
        this.$audio = this.shadowRoot.querySelector('audio');
    }

    _setListeners() {
        this.addEventListener('click', this.togglePlay);
    }

    /*
        List of custom component's methods
        Any other methods
    */
    togglePlay() {
        if (!this.getAttribute('in-progress')) {
            this.setAttribute('in-progress', 'true');
            this.$audio.play();
        } else {
            this.removeAttribute('in-progress');
            this.$audio.pause();
        }
    }
}

window.customElements.define('u-play', UPlay);