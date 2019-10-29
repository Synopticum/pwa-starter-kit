import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {pathControls} from "./UPathControls.reducer";
import {clearPathState, deletePath, putPath} from "../u-path/UPath.actions";
// import {deletePhoto} from "../u-photo-upload/UPhotoUpload.actions";
// import '../u-photo-upload/UPhotoUpload';
import '../u-text-button/UTextButton';
import {setCloudsVisibility} from "../u-map/UMap.actions";
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
                    <div class="controls__segment-title">Настройки пути</div>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Заголовок:</label>
                       
                       <div class="controls__input">
                           <input type="text" @keyup="${this.inputTitle}" value="${this._path.title}" class="textinput">
                           <u-text-button @click="${this.changeTitle}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Краткое описание:</label>
                       
                       <div class="controls__input">
                           <textarea @keyup="${this.inputShortDescription}" class="textarea">${this._path.shortDescription}</textarea>
                           <u-text-button type="button" @click="${this.changeShortDescription}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Полное описание:</label>
                       
                       <div class="controls__input">
                           <textarea @keyup="${this.inputFullDescription}" class="textarea">${this._path.fullDescription}</textarea>
                           <u-text-button type="button" @click="${this.changeFullDescription}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__delete-path">
                       <u-text-button class="remove"
                                      ?disabled="${this._isFetching || this._isUpdating}"
                                      @click="${this.remove}">Удалить путь</u-text-button>
                    </section>
                </main>
                        
                <main class="controls__segment">     
                    <div class="controls__segment-title">Настройки фотографии</div>
                               
                    ${this.hasImage() ?
                        html`<section class="controls__section controls__delete-photo">
                                <u-text-button class="delete-image"
                                               ?disabled="${this._isFetching || this._isUpdating}"
                                               @click="${this.deletePhoto}">Удалить текущую фотографию</u-text-button>
                             </section>` : ''}
                </main>
                     
                <main class="controls__segment">
                    <section class="controls__section controls__add-photo">
                       <label for="${this.pathId}" class="controls__label">Добавить новую фотографию:</label>
                       <u-photo-upload type="path"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       id="${this.pathId}"></u-photo-upload>
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
        store.dispatch(deletePath(this.pathId));
        this.close();
    }

    close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearPathState());
        this.dispatchEvent(new CustomEvent('hide-path', {composed: true}));
    }

    deletePhoto() {
        store.dispatch(deletePhoto('path', this.pathId));
    }

    changePathLabel(e) {
        let label = e.target.value;

        let updatedPath = {
            ...this._path,
            label
        };

        store.dispatch(putPath(updatedPath, this.pathId));
    }

    hasImage() {
        return Boolean(this._activeImage);
    }

    inputTitle(e) {
        this.title = e.target.value;
    }

    changeTitle() {
        let updatedPath = { ...this._path, title: this.title };
        store.dispatch(putPath(updatedPath, this.pathId));
    }

    inputShortDescription(e) {
        this.shortDescription = e.target.value;
    }

    changeShortDescription() {
        let updatedPath = { ...this._path, shortDescription: this.shortDescription };
        store.dispatch(putPath(updatedPath, this.pathId));
    }

    inputFullDescription(e) {
        this.fullDescription = e.target.value;
    }

    changeFullDescription() {
        let updatedPath = { ...this._path, fullDescription: this.fullDescription };
        store.dispatch(putPath(updatedPath, this.pathId));
    }
}

window.customElements.define('u-path-controls', UPathControls);