import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../store';
import {connect} from 'pwa-helpers';
import {objectControls} from "./UObjectControls.reducer";
import {clearObjectState, deleteObject, putObject} from "../UObject.actions";
import {deletePhoto} from "../../u-photo-upload/UPhotoUpload.actions";
import '../../u-photo-upload/UPhotoUpload';
import '../../shared/u-text-button/UTextButton';
import {setCloudsVisibility} from "../../u-map/UMap.actions";
import props from './UObjectControls.props';
import styles from './UObjectControls.styles';

store.addReducers({objectControls});

export class UObjectControls extends connect(store)(LitElement) {
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
          <div class="u-object-controls">
            <div class="title">Управление</div>
        
            <div class="controls">  
                <main class="controls__segment">
                    <div class="controls__segment-title">Настройки объекта</div>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Заголовок:</label>
                       
                       <div class="controls__input">
                           <input type="text" @keyup="${this.inputTitle}" value="${this._object.title}" class="textinput">
                           <u-text-button @click="${this.changeTitle}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Краткое описание:</label>
                       
                       <div class="controls__input">
                           <textarea @keyup="${this.inputShortDescription}" class="textarea">${this._object.shortDescription}</textarea>
                           <u-text-button type="button" @click="${this.changeShortDescription}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Полное описание:</label>
                       
                       <div class="controls__input">
                           <textarea @keyup="${this.inputFullDescription}" class="textarea">${this._object.fullDescription}</textarea>
                           <u-text-button type="button" @click="${this.changeFullDescription}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__street">
                       <label class="controls__label">Улица:</label>
                       
                       <div class="controls__input">
                           <input type="text" @keyup="${this.inputStreet}" class="textarea" value="${this._object.street}">
                           <u-text-button type="button" @click="${this.changeStreet}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__house">
                       <label class="controls__label">Номер дома:</label>
                       
                       <div class="controls__input">
                           <input type="text" @keyup="${this.inputHouse}" class="textarea" value="${this._object.house}">
                           <u-text-button type="button" @click="${this.changeHouse}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__delete-object">
                       <u-text-button class="remove"
                                      ?disabled="${this._isFetching || this._isUpdating}"
                                      @click="${this.remove}">Удалить объект</u-text-button>
                    </section>
                </main>
                        
                <main class="controls__segment">     
                    <div class="controls__segment-title">Настройки фотографии</div>
                               
                    <section class="controls__section controls__delete-photo">
                        <u-text-button class="delete-image"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       @click="${this.deletePhoto}">Удалить текущую фотографию</u-text-button>
                     </section>
                </main>
                     
                <main class="controls__segment">
                    <section class="controls__section controls__add-photo">
                       <label for="${this.objectId}" class="controls__label">Добавить новую фотографию:</label>
                       <u-photo-upload type="object"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       id="${this.objectId}"></u-photo-upload>
                    </section>
                </main>
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
        this._object = state.objectPage.object;

        this._objectControls = state.objectControls;

        this._isFetching = state.objectPage.isFetching;
        this._isUpdating = state.objectPage.isUpdating;
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
        store.dispatch(deleteObject(this.objectId));
        this.close();
    }

    close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearObjectState());
        this.dispatchEvent(new CustomEvent('hide-object', {composed: true}));
    }

    deletePhoto() {
        store.dispatch(deletePhoto('object', this.objectId, this.activeYear));
    }

    changeObjectLabel(e) {
        let label = e.target.value;

        let updatedObject = {
            ...this._object,
            label
        };

        store.dispatch(putObject(updatedObject, this.objectId));
    }

    inputTitle(e) {
        this.title = e.target.value;
    }

    changeTitle() {
        let updatedObject = { ...this._object, title: this.title };
        store.dispatch(putObject(updatedObject, this.objectId));
    }

    inputStreet(e) {
        this.street = e.target.value;
    }

    changeStreet() {
        let updatedObject = { ...this._object, street: this.street };
        store.dispatch(putObject(updatedObject, this.objectId));
    }

    inputHouse(e) {
        this.house = e.target.value;
    }

    changeHouse() {
        let updatedObject = { ...this._object, house: this.house };
        store.dispatch(putObject(updatedObject, this.objectId));
    }

    inputShortDescription(e) {
        this.shortDescription = e.target.value;
    }

    changeShortDescription() {
        let updatedObject = { ...this._object, shortDescription: this.shortDescription };
        store.dispatch(putObject(updatedObject, this.objectId));
    }

    inputFullDescription(e) {
        this.fullDescription = e.target.value;
    }

    changeFullDescription() {
        let updatedObject = { ...this._object, fullDescription: this.fullDescription };
        store.dispatch(putObject(updatedObject, this.objectId));
    }
}

window.customElements.define('u-object-controls', UObjectControls);