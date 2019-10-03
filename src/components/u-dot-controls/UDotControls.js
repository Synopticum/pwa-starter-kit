import {html, LitElement} from 'lit-element/lit-element';
import debounce from 'lodash-es/debounce';
import {classMap} from 'lit-html/directives/class-map';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {dotControls} from "./UDotControls.reducer";
import {clearDotState, deleteDot, putDot} from "../u-dot/UDot.actions";
import {deletePhoto} from "../u-photo-upload/UPhotoUpload.actions";
import '../u-photo-upload/UPhotoUpload';
import '../u-text-button/UTextButton';
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
        let selectTypeClasses = {
            'select-type': true,
            'select-type--active': this._dot.type
        };

        let selectLayerClasses = {
            'select-layer': true,
            'select-layer--active': this._dot.layer
        };

        let selectLabelClasses = {
            'select-label': true,
            'select-label--active': this._dot.label
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
                           <button type="button" @click="${this.changeTitle}" class="textbutton">Сохранить</button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Краткое описание:</label>
                       
                       <div class="controls__input">
                           <textarea @keyup="${this.inputShortDescription}" class="textarea">${this._dot.shortDescription}</textarea>
                           <button type="button" @click="${this.changeShortDescription}" class="textbutton">Сохранить</button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__title">
                       <label class="controls__label">Полное описание:</label>
                       
                       <div class="controls__input">
                           <textarea @keyup="${this.inputFullDescription}" class="textarea">${this._dot.fullDescription}</textarea>
                           <button type="button" @click="${this.changeFullDescription}" class="textbutton">Сохранить</button>
                       </div>
                    </section>
                    
                    <section class="controls__section controls__select-type">
                       <label for="select-label" class="controls__label">Тип:</label>                      
                        <select class="${classMap(selectTypeClasses)}" @change="${this.changeDotType}" id="select-type"> 
                            <option value="0" ?selected="${!this._dot.type}" disabled hidden>Выберите тип</option>
                            <option value="old-and-new" ?selected="${this._dot.type === 'old-and-new'}">Содержит старое и новое фото</option>
                            <option value="old" ?selected="${this._dot.type === 'old'}">Содержит только старое фото</option>
                            <option value="new" ?selected="${this._dot.type === 'new'}">Содержит только новое фото</option>
                        </select>
                    </section>
                    
                    <section class="controls__section controls__select-layer">
                       <label for="select-select-layer" class="controls__label">Слой:</label>      
                        <select class="${classMap(selectLayerClasses)}" @change="${this.changeDotLayer}" id="select-layer"> 
                           <option value="0" ?selected="${!this._dot.layer}" disabled hidden>Выберите слой</option>
                           ${this.decadeLayers.map(decade => html`<option value="${decade}" ?selected="${this._dot.layer === decade}">${decade}</option>`)}
                       </select>
                    </section>  
                    
                    <section class="controls__section controls__delete-dot">
                       <u-text-button class="remove"
                                      ?disabled="${this._isFetching || this._isUpdating}"
                                      @click="${this.remove}">Удалить точку</u-text-button>
                    </section>
                </main>
                        
                <main class="controls__segment">     
                    <div class="controls__segment-title">Настройки фотографии</div>        
                    
                    <section class="controls__section controls__select-label">
                       <label for="select-label" class="controls__label">Выберите десятилетие съемки:</label>
                        <select class="${classMap(selectLabelClasses)}" @change="${this.changeDotLabel}" id="select-label"> 
                            <option value="0" ?selected="${!this._dot.label}" disabled hidden>Выберите метку</option>
                            ${Object.entries(this.decadeLabels).map(entry => html`<option value="${entry[0]}" ?selected="${this._dot.label === entry[0]}">${entry[1]}</option>`)}
                        </select>
                    </section>
                               
                    ${this.hasImage() ?
                        html`<section class="controls__section controls__delete-photo">
                                <u-text-button class="delete-image"
                                               ?disabled="${this._isFetching || this._isUpdating}"
                                               @click="${this.deletePhoto}">Удалить текущую фотографию</u-text-button>
                             </section>` : ''}
                </main>
                     
                <main class="controls__segment">     
                    <section class="controls__section controls__add-photo">
                       <label for="${this.dotId}" class="controls__label">Добавить новую фотографию:</label>
                       <u-photo-upload type="dot"
                                       ?disabled="${this._isFetching || this._isUpdating}"
                                       id="${this.dotId}"></u-photo-upload>
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
        this.decadeLabels = {
            '40th': 'Сороковые',
            '50th': 'Пятидесятые',
            '60th': 'Шестидесятые',
            '70th': 'Семидесятые',
            '80th': 'Восьмидесятые',
            '90th': 'Девяностые',
            '00th': 'Нулевые',
            '10th': 'Десятые',
            'unknown': 'Неизвестно'
        };

        this.decadeLayers = [
            'Сороковые',
            'Пятидесятые',
            'Шестидесятые',
            'Семидесятые',
            'Восьмидесятые',
            'Девяностые',
            'Нулевые',
            'Десятые',
            'Неизвестно',
            'Sergey Novikov'
        ];
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
        store.dispatch(deletePhoto('dot', this.dotId, this._activeDecade));
    }

    changeDotLabel(e) {
        let label = e.target.value;
        let updatedDot = { ...this._dot, label };
        store.dispatch(putDot(updatedDot, this.dotId));
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

    hasImage() {
        return Boolean(this._activeImage);
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
}

window.customElements.define('u-dot-controls', UDotControls);