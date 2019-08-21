import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {fetch, toggle} from './UDotControls.actions';
import {dotControls} from "./UDotControls.reducer";
import {isAdmin,isAnonymous} from "../u-app/UApp.helpers";
import {clearDotState, deleteDot, putDot} from "../u-dot/UDot.actions";
import {deletePhoto} from "../u-photo-upload/UPhotoUpload.actions";
import '../u-photo-upload/UPhotoUpload';
import {setCloudsVisibility} from "../u-map/UMap.actions";
import props from './UDotControls.props';
import styles from './UDotControls.styles';

store.addReducers({dotControls});

export class UDotControls extends connect(store)(LitElement) {
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
          <div class="u-dot-controls">
            <div class="controls">
                <div class="controls__photo">
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) && this._activeImage ?
                        html`<u-button class="delete-image"
                                       type="danger"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       @click="${() => this.deleteImage(this._activeDecade)}">Удалить фото</u-button>` : ''}
                              
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                        html`<u-photo-upload type="dot"
                                             ?disabled="${this._isFetching || this._isUpdating}"
                                             id="${this.dotId}"></u-photo-upload>` : ''}
                </div>
                          
                <div class="controls__type">
                    <select class="select-label ${this._dot.label ? 'select-label--active' : ''}" @change="${this.changeDotLabel}"> 
                        <option value="0" ?selected="${!this._dot.label}" disabled hidden>Выберите метку</option>
                        <option value="40th" ?selected="${this._dot.label === '40th'}">Сороковые</option>
                        <option value="50th" ?selected="${this._dot.label === '50th'}">Пятидесятые</option>
                        <option value="60th" ?selected="${this._dot.label === '60th'}">Шестидесятые</option>
                        <option value="70th" ?selected="${this._dot.label === '70th'}">Семидесятые</option>
                        <option value="80th" ?selected="${this._dot.label === '80th'}">Восьмидесятые</option>
                        <option value="90th" ?selected="${this._dot.label === '90th'}">Девяностые</option>
                        <option value="00th" ?selected="${this._dot.label === '00th'}">Нулевые</option>
                        <option value="10th" ?selected="${this._dot.label === '10th'}">Десятые</option>    
                        <option value="unknown" ?selected="${this._dot.label === 'unknown'}">Неизвестно</option>     
                    </select>
                            
                    <select class="select-label ${this._dot.type ? 'select-type--active' : ''}" @change="${this.changeDotType}"> 
                        <option value="0" ?selected="${!this._dot.type}" disabled hidden>Выберите тип</option>
                        <option value="old-and-new" ?selected="${this._dot.type === 'old-and-new'}">Старое и новое</option>
                        <option value="old" ?selected="${this._dot.type === 'old'}">Только старое</option>
                        <option value="new" ?selected="${this._dot.type === 'new'}">Только новое</option>
                    </select>
                            
                   <select class="select-layer ${this._dot.layer ? 'select-layer--active' : ''}" @change="${this.changeDotLayer}"> 
                       <option value="0" ?selected="${!this._dot.layer}" disabled hidden>Выберите слой</option>
                       <option value="Сороковые" ?selected="${this._dot.layer === 'Сороковые'}">Сороковые</option>
                       <option value="Пятидесятые" ?selected="${this._dot.layer === 'Пятидесятые'}">Пятидесятые</option>
                       <option value="Шестидесятые" ?selected="${this._dot.layer === 'Шестидесятые'}">Шестидесятые</option>
                       <option value="Семидесятые" ?selected="${this._dot.layer === 'Семидесятые'}">Семидесятые</option>
                       <option value="Восьмидесятые" ?selected="${this._dot.layer === 'Восьмидесятые'}">Восьмидесятые</option>
                       <option value="Девяностые" ?selected="${this._dot.layer === 'Девяностые'}">Девяностые</option>
                       <option value="Нулевые" ?selected="${this._dot.layer === 'Нулевые'}">Нулевые</option>
                       <option value="Десятые" ?selected="${this._dot.layer === 'Десятые'}">Десятые</option>
                       <option value="Неизвестно" ?selected="${this._dot.layer === 'Неизвестно'}">Неизвестно</option>
                       <option value="Sergey Novikov" ?selected="${this._dot.layer === 'Sergey Novikov'}">Sergey Novikov</option>
                   </select>
                </div>
                             
                <div class="controls__dot">
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                        html`<u-button class="remove"
                                       type="danger"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       @click="${(e) => this.remove(e)}">Удалить точку</u-button>` : ''}
                </div>
            </div>
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._user = state.app.user;
        this._dot = state.dotPage.dot;

        this._dotControls = state.dotControls;

        this._activeImage = state.dotPage.activeImage;
        this._activeDecade = state.dotPage.activeDecade;

        this._isFetching = state.dotPage.isFetching;
        this._isUpdating = state.dotPage.isUpdating;
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
        // store.dispatch(fetch());
    }

    _setReferences() {
        this.$container = this.shadowRoot.querySelector('.u-smart-template');
    }

    _setListeners() {
        this.addEventListener('click', e => e.stopPropagation());
    }

    _setDefaults() {

    }

    /*
        List of custom component's methods
        Any other methods
    */
    remove() {
        store.dispatch(deleteDot(this.dotId));
        this.close();
    }

    close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearDotState());
        this.dispatchEvent(new CustomEvent('hide-dot', {composed: true}));
    }

    deleteImage(date) {
        store.dispatch(deletePhoto('dot', this.dotId, date));
    }

    changeDotLabel(e) {
        let label = e.target.value;

        let updatedDot = {
            ...this._dot,
            label
        };

        store.dispatch(putDot(updatedDot, this.dotId));
    }

    changeDotType(e) {
        let type = e.target.value;

        let updatedDot = {
            ...this._dot,
            type
        };

        store.dispatch(putDot(updatedDot, this.dotId));
    }

    changeDotLayer(e) {
        let layer = e.target.value;

        let updatedDot = {
            ...this._dot,
            layer
        };

        store.dispatch(putDot(updatedDot, this.dotId));
    }
}

window.customElements.define('u-dot-controls', UDotControls);