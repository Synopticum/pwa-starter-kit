import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';

import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {photoUpload} from "./UPhotoUpload.reducer";
import {uploadPhoto} from './UPhotoUpload.actions';
import '../u-text-button/UTextButton';

import props from './UPhotoUpload.props';
import styles from './UPhotoUpload.styles';

store.addReducers({photoUpload});

class UPhotoUpload extends connect(store)(LitElement) {
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
        let selectDecadeClasses = {
            'select-decade': true,
            'select-decade--active': this.isFileSelected
        };

        let uploadButtonClasses = {
            'upload': true,
            'upload--active': this.isFileSelected && this.decade
        };

        return html`
          <div class="u-photo-upload">        
            <input type="file"
                   id="upload"
                   class="select-image" 
                   accept="image/png, image/jpeg"
                   @change="${this.selectFile}"
                   ?disabled="${this.disabled || this._isUploading}">
                                             
            <select class="${classMap(selectDecadeClasses)}" @change="${this.changeDecade}">
                <option value="0" ?selected="${!this.decade}" disabled hidden>Выберите десятилетие съемки</option>
                <option value="1940" ?selected="${this.decade === '1940'}">В сороковых</option>
                <option value="1950" ?selected="${this.decade === '1950'}">В пятидесятых</option>
                <option value="1960" ?selected="${this.decade === '1960'}">В шестидесятых</option>
                <option value="1970" ?selected="${this.decade === '1970'}">В семидесятых</option>
                <option value="1980" ?selected="${this.decade === '1980'}">В восьмидесятых</option>
                <option value="1990" ?selected="${this.decade === '1990'}">В девяностых</option>
                <option value="2000" ?selected="${this.decade === '2000'}">В нулевых</option>
                <option value="2010" ?selected="${this.decade === '2010'}">В десятых</option>
            </select>
                   
            <u-text-button 
                class="${classMap(uploadButtonClasses)}"
                @click="${this.upload}"
                ?disabled="${this._isUploading || !this.decade || !this.isFileSelected}">Загрузить!</u-text-button>
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
    upload() {
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
