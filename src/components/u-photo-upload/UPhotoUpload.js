import {html, LitElement} from 'lit-element/lit-element';

import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {photoUpload} from "../../reducers/UPhotoUpload.reducer";

store.addReducers({photoUpload});

class UPhotoUpload extends connect(store)(LitElement) {

    static get properties() {
        return {
        };
    }

    render() {
        return html`

          <style>
            :host {
                display: flex;
            }
          </style>
          
          <div class="upload">        
            <input type="file"
                   id="upload" 
                   accept="image/png, image/jpeg">
                   
             <button type="button" @click="${this.upload}">Upload</button>
          </div>
    `
    }

    constructor() {
        super();
    }

    stateChanged(state) {
        this._user = state.app.user;
    }

    firstUpdated() {
        this._init();
    }

    _init() {
        this._setReferences();
    }

    _setReferences() {
        this.$input = this.shadowRoot.querySelector(`#upload`);
    }

    upload() {
        console.log(this.$input);
    }
}

window.customElements.define('u-photo-upload', UPhotoUpload);
