import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../store';
import {connect} from 'pwa-helpers';
import {objectControls} from "./UObjectControls.reducer";
import {clearEntityState, deleteEntity, putEntity} from "../../u-entity/UEntity.actions";
import {deletePhoto} from "../../u-photo-upload/UPhotoUpload.actions";
import '../../u-photo-upload/UPhotoUpload';
import '../../shared/u-textbox/UTextbox';
import '../../shared/u-textarea/UTextarea';
import '../../shared/u-text-button/UTextButton';
import '../../shared/u-icon-button/UIconButton';
import {setCloudsVisibility} from "../../u-map/UMap.actions";
import props from './UObjectControls.props';
import styles from './UObjectControls.styles';

store.addReducers({objectControls});

const NOT_SET = '[Не задано]';

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
                           <u-textbox 
                                type="text" 
                                @keyup="${this.inputTitle}" 
                                value="${this._object.title}" 
                                class="textinput"></u-textbox>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Краткое описание:</label>
                       
                       <div class="controls__input">
                           <u-textarea 
                                @keyup="${this.inputShortDescription}" 
                                class="textarea"
                                value="${this._object.shortDescription}"></u-textarea>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Полное описание:</label>
                       
                       <div class="controls__input">
                           <u-textarea 
                                @keyup="${this.inputFullDescription}" 
                                class="textarea"
                                value="${this._object.fullDescription}"></u-textarea>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__street">
                       <div class="controls__row">
                        <div class="controls__col">
                           <label class="controls__label">Улица:</label>
                       
                           <div class="controls__input">
                               <u-textbox 
                                    type="text" 
                                    @keyup="${this.inputStreet}" 
                                    class="textinput street" 
                                    value="${this._object.street}"></u-textbox>
                           </div>
                        </div>
                        
                        <div class="controls__col">
                           <label class="controls__label">Номер дома:</label>
                           
                           <div class="controls__input">
                               <u-textbox 
                                    type="text" 
                                    @keyup="${this.inputHouse}" 
                                    class="textinput house" 
                                    value="${this._object.house}"></u-textbox>
                           </div>
                        </div>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__delete-object">
                       <u-text-button class="remove"
                                      ?disabled="${this._isFetching || this._isUpdating}"
                                      @click="${this.remove}">Удалить объект</u-text-button>
                                    
                       <u-text-button 
                            type="button" 
                            @click="${this.saveChanges}" 
                            class="save">Сохранить</u-text-button>
                    </section>
                </main>
                        
                <main class="controls__segment">     
                    <div class="controls__segment-title">Настройки фотографии</div>
                    
                    <section class="controls__section controls__add-photo">
                       <label for="${this.objectId}" class="controls__label">Добавить новую фотографию:</label>
                       <u-photo-upload type="object"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       id="${this.objectId}"
                                       .activeYear="${this._activeYear}"></u-photo-upload>
                    </section>
                               
                    <section class="controls__section controls__delete-photo">
                        <u-text-button class="delete-image"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       @click="${this.deletePhoto}">Удалить текущую фотографию</u-text-button>
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

        this._activeYear = state.objectPage.activeYear;

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
        store.dispatch(deleteEntity('type', this.objectId));
        this.close();
    }

    close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearEntityState('object'));
        this.dispatchEvent(new CustomEvent('hide-object', {composed: true}));
    }

    deletePhoto() {
        store.dispatch(deletePhoto('object', this.objectId, this._activeYear));
    }

    inputTitle(e) {
        this.title = e.target.value;
    }

    inputStreet(e) {
        this.street = e.target.value;
    }

    inputHouse(e) {
        this.house = e.target.value;
    }

    inputShortDescription(e) {
        this.shortDescription = e.target.value;
    }

    inputFullDescription(e) {
        this.fullDescription = e.target.value;
    }

    saveChanges() {
        let updatedObject = {
            ...this._object,
            title: this.title,
            street: this.street,
            house: this.house,
            shortDescription: this.shortDescription,
            fullDescription: this.fullDescription
        };

        store.dispatch(putEntity('object', updatedObject, this.objectId));
    }
}

window.customElements.define('u-object-controls', UObjectControls);