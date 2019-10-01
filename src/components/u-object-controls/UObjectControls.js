import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {objectControls} from "./UObjectControls.reducer";
import {clearObjectState, deleteObject, putObject} from "../u-object/UObject.actions";
// import {deletePhoto} from "../u-photo-upload/UPhotoUpload.actions";
// import '../u-photo-upload/UPhotoUpload';
import '../u-text-button/UTextButton';
import {setCloudsVisibility} from "../u-map/UMap.actions";
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
                    
                    <section class="controls__section controls__delete-object">
                       <u-text-button class="remove"
                                      ?disabled="${this._isFetching || this._isUpdating}"
                                      @click="${this.remove}">Удалить объект</u-text-button>
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
        store.dispatch(deletePhoto('object', this.objectId));
    }

    changeObjectLabel(e) {
        let label = e.target.value;

        let updatedObject = {
            ...this._object,
            label
        };

        store.dispatch(putObject(updatedObject, this.objectId));
    }

    hasImage() {
        return Boolean(this._activeImage);
    }
}

window.customElements.define('u-object-controls', UObjectControls);