import {html, LitElement} from 'lit-element/lit-element';

import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {photoUpload} from "../../reducers/UPhotoUpload.reducer";
import {uploadPhoto} from './UPhotoUpload.actions';
import '../u-button/UButton';

store.addReducers({photoUpload});

class UPhotoUpload extends connect(store)(LitElement) {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return {
            _isUploading: {
                type: String,
                attribute: false
            },

            type: {
                type: String,
                attribute: 'type'
            },

            decade: {
                type: String,
                attribute: false
            },

            isFileSelected: {
                type: Boolean,
                attribute: false
            },

            id: {
                type: String,
                attribute: 'id'
            },

            disabled: {
                type: Boolean,
                attribute: 'disabled'
            }
        };
    }

    render() {
        return html`

          <style>
            :host {
                display: flex;
            }
            
            .u-photo-upload {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            /* input file */
            .select-image {
              position: relative;
              cursor: pointer;
              display: inline-flex;
              color: transparent;
              outline: 0;
              width: 143px;
              height: 36px;
              border-radius: 0 15px 15px 0;
              background: linear-gradient(#ffffff, #cccccc);
              background-size: 15px;
              box-shadow: 2px 2px 2px rgba(0,0,0,.5);
            }
            :host(:only-child) .select-image {
                border-radius: 15px;
            }
            .select-image::before {
                content: 'Добавить фото';
                position: absolute;
                top: 7px;
                left: 15px;
                font-family: 'PT Serif', 'Times New Roman', serif;
                color: #000000;
                font-size: 16px;
            }
            .select-image:active {
              background: linear-gradient(#cccccc, #ffffff);
            }
            .select-image::-webkit-file-upload-button {
              visibility: hidden;
            }
            
            .select-image:disabled {
                cursor: not-allowed;
                opacity: .3;
            }
        
            /* select */
            .select-decade {
                display: none;
                font-family: 'PT Serif', 'Times New Roman', serif;
                font-size: 16px;
                color: #000;
                line-height: 1.3;
                padding: 8px 35px 8px 15px;
                width: 100%;
                max-width: 100%; 
                box-sizing: border-box;
                margin: 0 0 0 15px;
                border: 0;
                -moz-appearance: none;
                -webkit-appearance: none;
                appearance: none;
                background: url('static/images/button-icons/select.svg') no-repeat calc(100% - 10px) 50%, linear-gradient(#ffffff, #cccccc);
                background-size: 15px;
                outline: none;
                border-radius: 15px;
            }
            
            .select-decade::-ms-expand {
                display: none;
            }
            
            .select-decade option {
                font-weight:normal;
            }
            
            .select-decade--active {
                display: inline-flex;
            }
            
            /* upload button */
            .upload {
                display: none;
                margin-left: 15px;
                --border-radius: 15px;
            }
            
            .upload--active {
                display: inline-flex;
            }
          </style>
          
          <div class="u-photo-upload">        
            <input type="file"
                   id="upload"
                   class="select-image" 
                   accept="image/png, image/jpeg"
                   @change="${this.selectFile}"
                   ?disabled="${this.disabled || this._isUploading}">
                                             
            <select class="select-decade ${this.isFileSelected ? 'select-decade--active' : ''}" @change="${this.changeDecade}">
                <option value="0" ?selected="${!this.decade}" disabled hidden>Когда оно было снято?</option>
                <option value="1940" ?selected="${this.decade === '1940'}">В сороковых</option>
                <option value="1950" ?selected="${this.decade === '1950'}">В пятидесятых</option>
                <option value="1960" ?selected="${this.decade === '1960'}">В шестидесятых</option>
                <option value="1970" ?selected="${this.decade === '1970'}">В семидесятых</option>
                <option value="1980" ?selected="${this.decade === '1980'}">В восьмидесятых</option>
                <option value="1990" ?selected="${this.decade === '1990'}">В девяностых</option>
                <option value="2000" ?selected="${this.decade === '2000'}">В нулевых</option>
                <option value="2010" ?selected="${this.decade === '2010'}">В десятых</option>
            </select>
                   
            <u-button 
                type="regular"
                class="upload ${this.isFileSelected && this.decade ? 'upload--active' : ''}"
                @click="${() => this.upload(this.albumName)}"
                ?disabled="${this._isUploading || !this.decade || !this.isFileSelected}">Загрузить!</u-button>
          </div>
    `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._user = state.app.user;
        this._isUploading = state.photoUpload.isUploading;
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
        this.decade = '';
        this.isFileSelected = false;
    }

    /*
        List of custom component's methods
        Any other methods
    */
    upload(albumName) {
        let files = this.$input.files;

        const photo = files[0];
        store.dispatch(uploadPhoto(photo, this.type, this.decade, this.id));

        this.isFileSelected = false;
        this.decade = '';
    }

    selectFile(e) {
        this.isFileSelected = Boolean(e.target.files.length);
    }

    changeDecade(e) {
        this.decade = e.target.value;
    }
}

window.customElements.define('u-photo-upload', UPhotoUpload);
