import {html, LitElement} from 'lit-element/lit-element';

import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {photoUpload} from "../../reducers/UPhotoUpload.reducer";
import {uploadPhoto} from './UPhotoUpload.actions';

store.addReducers({photoUpload});

class UPhotoUpload extends connect(store)(LitElement) {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return {
            albumName: {
                type: String,
                attribute: 'album-name'
            },

            s3: {
                type: Object,
                attribute: false
            }
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
                   
             <button type="button" @click="${() => this.upload(this.albumName)}">Upload</button>
          </div>
    `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._user = state.app.user;
    }

    firstUpdated() {
        this._init();
    }

    _init() {
        this._setStore();
        this._setReferences();
        this._setListeners();
    }

    _setStore() {

    }

    _setReferences() {
        this.$input = this.shadowRoot.querySelector(`#upload`);
    }

    _setListeners() {

    }

    _setDefaults() {

    }

    /*
        List of custom component's methods
        Any other methods
    */
    upload(albumName) {
        let files = this.$input.files;

        if (!files.length) {
            return alert('Please choose a file to upload first.');
        }

        let photo = files[0];
        let key = `${encodeURIComponent(albumName)}/${photo.name}`;

        store.dispatch(uploadPhoto(photo, key));
    }
}

window.customElements.define('u-photo-upload', UPhotoUpload);
