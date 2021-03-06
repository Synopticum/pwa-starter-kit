import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../store';
import {connect} from 'pwa-helpers';
import {pathControls} from "./UPathControls.reducer";
import {clearEntityState, deleteEntity, putEntity} from "../../u-entity/UEntity.actions";
import {deletePhoto} from "../../u-photo-upload/UPhotoUpload.actions";
import '../../u-photo-upload/UPhotoUpload';
import '../../shared/u-text-button/UTextButton';
import {setCloudsVisibility} from "../../u-map/UMap.actions";
import props from './UPathControls.props';
import styles from './UPathControls.styles';

store.addReducers({pathControls});

export class UPathControls extends connect(store)(LitElement) {
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
          <div class="u-path-controls">
            <div class="title">Управление</div>
        
            <div class="controls">  
                <main class="controls__segment">
                    <div class="controls__segment-title">Настройки объекта</div>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Заголовок:</label>
                       
                       <div class="controls__input">
                           <u-textbox type="text" @keyup="${this.inputTitle}" value="${this._path.title}" class="textinput">
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Краткое описание:</label>
                       
                       <div class="controls__input">
                           <u-textarea @keyup="${this.inputShortDescription}" class="textarea" value="${this._path.shortDescription}"></u-textarea>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Полное описание:</label>
                       
                       <div class="controls__input">
                           <u-textarea @keyup="${this.inputFullDescription}" class="textarea" value="${this._path.fullDescription}"></u-textarea>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__delete-path">
                       <u-text-button class="remove"
                                      ?disabled="${this._isFetching || this._isUpdating}"
                                      @click="${this.remove}">Удалить объект</u-text-button>
                                      
                       <u-text-button type="button" @click="${this.saveChanges}" class="save">Сохранить</u-text-button>
                    </section>
                </main>
                        
                <main class="controls__segment">     
                    <div class="controls__segment-title">Настройки фотографии</div>
                    
                    <section class="controls__section controls__add-photo">
                       <label for="${this.pathId}" class="controls__label">Добавить новую фотографию:</label>
                       <u-photo-upload type="path"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       id="${this.pathId}"
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
        this._path = state.pathPage.path;

        this._pathControls = state.pathControls;

        this._activeYear = state.pathPage.activeYear;

        this._isFetching = state.pathPage.isFetching;
        this._isUpdating = state.pathPage.isUpdating;
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
        store.dispatch(deleteEntity('path', this.pathId));
        this.close();
    }

    close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearEntityState('path'));
        this.dispatchEvent(new CustomEvent('hide-path', {composed: true}));
    }

    deletePhoto() {
        store.dispatch(deletePhoto('path', this.pathId, this._activeYear));
    }

    inputTitle(e) {
        this.title = e.target.value;
    }

    inputShortDescription(e) {
        this.shortDescription = e.target.value;
    }

    inputFullDescription(e) {
        this.fullDescription = e.target.value;
    }

    saveChanges() {
        let updatedPath = {
            ...this._path,
            title: this.title,
            shortDescription: this.shortDescription,
            fullDescription: this.fullDescription
        };

        store.dispatch(putEntity('path', updatedPath, this.pathId));
    }
}

window.customElements.define('u-path-controls', UPathControls);