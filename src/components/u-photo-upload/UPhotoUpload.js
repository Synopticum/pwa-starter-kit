import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';

import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {photoUpload} from "./UPhotoUpload.reducer";
import {uploadPhoto} from './UPhotoUpload.actions';
import '../shared/u-text-button/UTextButton';
import { range } from '../../helpers/range';

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
        const selectYearClasses = {
            'select-year': true,
            'select-year--active': this.isFileSelected
        };

        const joinClasses = {
            'join': true,
            'join--active': this.isFileSelected
        };

        const uploadButtonClasses = {
            'upload': true,
            'upload--active': this.isFileSelected && this.year
        };

        return html`
          <div class="u-photo-upload">        
            <input type="file"
                   id="upload"
                   class="select-image" 
                   accept="image/png, image/jpeg"
                   @change="${this.selectFile}"
                   ?disabled="${this.disabled || this._isUploading}">
                                             
            <select class="${classMap(selectYearClasses)}" @change="${this.changeYear}">
                <option value="0" ?selected="${!this.year}" disabled hidden>Выберите год съемки</option>
                ${this.layers.map(layer => html`<option value="${layer.toString()}" ?selected="${this.year === layer.toString()}">${layer}</option>`)}
            </select>
            
            <div class="${classMap(joinClasses)}">
                <input 
                    type="checkbox" 
                    id="join"
                    @change="${this.toggleJoin}"
                    ?checked="${this.isJoinChecked}"
                    ?disabled="${this.disabled || this._isUploading}"> 
                <label for="join">Совместить с текущим</label>
            </div>
                   
            <u-text-button 
                class="${classMap(uploadButtonClasses)}"
                @click="${this.upload}"
                ?disabled="${this._isUploading || !this.year || !this.isFileSelected}">Загрузить!</u-text-button>
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
        this.year = '';
        this.isFileSelected = false;
        this.layers = range(1940,2020);
    }

    /*
        List of custom component's methods
        Any other methods
    */
    upload() {
        let files = this.$input.files;

        const photo = files[0];
        const id = this.id.split('-')[0];
        const join = this.isJoinChecked ? { activeYear: this.activeYear, newYear: this.year } : null;
        store.dispatch(uploadPhoto(photo, this.type, this.year, id, join));

        this.isFileSelected = false;
        this.year = '';
    }

    selectFile(e) {
        this.isFileSelected = Boolean(e.target.files.length);
    }

    toggleJoin(e) {
        this.isJoinChecked = e.currentTarget.checked;
    }

    changeYear(e) {
        this.year = e.target.value;
    }
}

window.customElements.define('u-photo-upload', UPhotoUpload);
