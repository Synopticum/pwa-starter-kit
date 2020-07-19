import {html, LitElement} from 'lit-element/lit-element';
import debounce from 'lodash-es/debounce';
import {classMap} from 'lit-html/directives/class-map';
import {store} from '../../../store';
import {connect} from 'pwa-helpers';
import {dotControls} from "./UDotControls.reducer";
import {clearDotState, deleteDot, putDot} from "../UDot.actions";
import {deletePhoto} from "../../u-photo-upload/UPhotoUpload.actions";
import '../../u-photo-upload/UPhotoUpload';
import '../../shared/u-text-button/UTextButton';
import {setCloudsVisibility} from "../../u-map/UMap.actions";
import props from './UDotControls.props';
import styles from './UDotControls.styles';
import { range } from '../../../helpers/range';

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
        let selectLayerClasses = {
            'select-layer': true,
            'select-layer--active': this._dot.layer
        };

        return html`
          <div class="u-dot-controls">
            <div class="title">Управление</div>
        
            <div class="controls">  
                <main class="controls__segment">
                    <div class="controls__segment-title">Настройки точки</div>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Заголовок:</label>
                       
                       <div class="controls__input">
                           <input type="text" @keyup="${this.inputTitle}" value="${this._dot.title}" class="textinput">
                           <u-text-button @click="${this.changeTitle}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Краткое описание:</label>
                       
                       <div class="controls__input">
                           <textarea @keyup="${this.inputShortDescription}" class="textarea">${this._dot.shortDescription}</textarea>
                           <u-text-button @click="${this.changeShortDescription}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Полное описание:</label>
                       
                       <div class="controls__input">
                           <textarea @keyup="${this.inputFullDescription}" class="textarea">${this._dot.fullDescription}</textarea>
                           <u-text-button @click="${this.changeFullDescription}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__select-layer">
                       <label for="select-layer" class="controls__label">Слой:</label>      
                        <select class="${classMap(selectLayerClasses)}" @change="${this.changeDotLayer}" id="select-layer"> 
                           <option value="0" ?selected="${!this._dot.layer}" disabled hidden>Выберите слой</option>
                           ${this.layers.map(layer => html`<option value="${layer.toString()}" ?selected="${this._dot.layer === layer.toString()}">${layer}</option>`)}
                       </select>
                    </section>  
                    
                    <section class="controls__section controls__select-rotation-angle">
                       <label for="select-rotation-angle" class="controls__label">Угол съемки:</label>  
                       
                       <div class="controls__input">
                           <input 
                            type="number" 
                            @keyup="${this.inputRotationAngle}" 
                            class="textarea" id="select-rotation-angle" value="${this._dot.rotationAngle}"/>
                            
                           <u-text-button @click="${this.changeRotationAngle}" class="save">Сохранить</u-text-button>
                       </div>
                    </section>  
                    
                    <section class="controls__section controls__delete-dot">
                       <u-text-button class="remove"
                                      ?disabled="${this._isFetching || this._isUpdating}"
                                      @click="${this.remove}">Удалить точку</u-text-button>
                    </section>
                </main>
                        
                <main class="controls__segment">     
                    <div class="controls__segment-title">Настройки фотографии</div>
                    
                    <section class="controls__section controls__add-photo">
                       <label for="${this.dotId}" class="controls__label">Добавить новую фотографию:</label>
                       <u-photo-upload type="dot"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       id="${this.dotId}"></u-photo-upload>
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
        this._dot = state.dotPage.dot;

        this._dotControls = state.dotControls;

        this._activeImage = state.dotPage.activeImage;
        this._activeYear = state.dotPage.activeYear;

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
        this.layers = range(1940,2020);
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

    deletePhoto() {
        store.dispatch(deletePhoto('dot', this.dotId, this._activeYear));
    }

    changeDotType(e) {
        let type = e.target.value;
        let updatedDot = { ...this._dot, type };
        store.dispatch(putDot(updatedDot, this.dotId));
    }

    changeDotLayer(e) {
        let layer = e.target.value;
        let updatedDot = { ...this._dot, layer };
        store.dispatch(putDot(updatedDot, this.dotId));
    }

    inputTitle(e) {
        this.title = e.target.value;
    }

    changeTitle() {
        let updatedDot = { ...this._dot, title: this.title };
        store.dispatch(putDot(updatedDot, this.dotId));
    }

    inputShortDescription(e) {
        this.shortDescription = e.target.value;
    }

    changeShortDescription() {
        let updatedDot = { ...this._dot, shortDescription: this.shortDescription };
        store.dispatch(putDot(updatedDot, this.dotId));
    }

    inputFullDescription(e) {
        this.fullDescription = e.target.value;
    }

    changeFullDescription() {
        let updatedDot = { ...this._dot, fullDescription: this.fullDescription };
        store.dispatch(putDot(updatedDot, this.dotId));
    }

    inputRotationAngle(e) {
        this.rotationAngle = e.target.value;
    }

    changeRotationAngle() {
        let updatedDot = { ...this._dot, rotationAngle: this.rotationAngle };
        store.dispatch(putDot(updatedDot, this.dotId));
    }
}

window.customElements.define('u-dot-controls', UDotControls);