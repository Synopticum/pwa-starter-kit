import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import { repeat } from 'lit-element/node_modules/lit-html/directives/repeat';
import {fetchDot, putDot, clearDotState, deleteDot, changeActiveImage} from './UDot.actions';
import {setCloudsVisibility} from '../u-map/UMap.actions';
import {dotPage} from "../../reducers/Dot.reducer";
import defer from 'lodash-es/defer';
import {deletePhoto} from "../u-photo-upload/UPhotoUpload.actions";
import {isAdmin, isAnonymous} from "../u-app/UApp.helpers";
import '../u-textbox/UTextbox';
import '../u-round-button/URoundButton';
import '../u-comments/UComments';
import '../u-photo-upload/UPhotoUpload';

store.addReducers({dotPage});

class UDot extends connect(store)(LitElement) {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return {
            dotId: {
                type: String
            },

            title: {
                type: String,
                attribute: false
            },

            shortDescription: {
                type: String,
                attribute: false
            },

            uploadDecade: {
                type: String,
                attribute: false
            },

            _user: {
                type: Object,
                attribute: false
            },

            _dot: {
                type: Object,
                attribute: false
            },

            _isFetching: {
                type: Boolean,
                attribute: false
            },

            _isUpdating: {
                type: Boolean,
                attribute: false
            },

            _isLoadingError: {
                type: Boolean,
                attribute: false
            }
        };
    }

    render() {
      return html`
      
      <style>
        :host {
            width: 100%;
            max-width: 900px;
            z-index: 200;
            pointer-events: all;
            transform: scale(1);
            transition: transform .3s;
            padding: 30px;
            border: 3px solid #6B9B29;
            border-radius: 3px;
            background-color: #f9f9f9;
            box-shadow: 4px 4px 4px rgba(0,0,0,.15);
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
            width: 0;
            height: 0;
        }
        
        .close {
            position: absolute;
            right: -15px;
            top: -15px;
        }
        
        .wrapper {
            display: flex;
            padding-bottom: 35px;
        }
        
        .form {
            flex: 2;
        }
        
        .comments {
            margin-left: 20px;
            flex: 1;
        }
        
        .upload {
            margin: 20px 0;
        }
        
        .submit {
            position: absolute;
            right: -15px;
            bottom: -15px;
        }
        
        .remove {
            position: absolute;
            right: 25px;
            bottom: -15px;
        }
        
        #dot-title,
        #dot-short-description,
        #dot-full-description {
          width: 100%;
          padding-left: 0;
          border-color: transparent;
        }
        
        #dot-title {
            font-size: 24px;
        }
        
        #dot-short-description,
        #dot-short-description {
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
        }
        
        .timeline {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px dotted #ccc;
        }
        
        .decade {
            cursor: default;
            padding: 5px 10px;
            opacity: .5;
            transition: background-color .2s;
        }
        
        .decade--active {
            cursor: pointer;
            opacity: 1;
        }
        
        .decade--active:hover {
            background-color: #eeeeee;
        }
      </style>
      
      <div class="dot">
        <u-round-button type="close" class="close" @click="${this.close}"></u-round-button>  
        
        ${!this._isLoadingError ?
          html`<div class="wrapper">
                  <div class="form">
                    <u-textbox
                         type="default"
                         id="dot-title"
                         ?is-fetching="${this._isFetching}" 
                         ?is-updating="${this._isUpdating}" 
                         ?disabled="${isAnonymous(this._user) || (!this.isDotAuthor(this._user) && !isAdmin(this._user))}"
                         value="${this.title || ''}"
                         placeholder="Введите название точки"></u-textbox>
                         
                    <u-textbox
                         type="default"
                         id="dot-short-description"
                         ?is-fetching="${this._isFetching}" 
                         ?is-updating="${this._isUpdating}" 
                         ?disabled="${isAnonymous(this._user) || (!this.isDotAuthor(this._user) && !isAdmin(this._user))}"
                         value="${this.shortDescription || ''}"
                         placeholder="Введите краткое описание"></u-textbox>
                         
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                        html`<u-photo-upload 
                                class="upload"
                                type="dot"
                                decade="${this.uploadDecade || '2010'}"
                                id="${this.dotId}"></u-photo-upload>` : ''}
                    
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                        html`<select id="decade" @change="${this.changeUploadDecade}">
                                <option value="1940" ?selected="${this.uploadDecade === '1940'}">Сороковые</option>
                                <option value="1950" ?selected="${this.uploadDecade === '1950'}">Пятидесятые</option>
                                <option value="1960" ?selected="${this.uploadDecade === '1960'}">Шестидесятые</option>
                                <option value="1970" ?selected="${this.uploadDecade === '1970'}">Семидесятые</option>
                                <option value="1980" ?selected="${this.uploadDecade === '1980'}">Восьмидесятые</option>
                                <option value="1990" ?selected="${this.uploadDecade === '1990'}">Девяностые</option>
                                <option value="2000" ?selected="${this.uploadDecade === '2000'}">Нулевые</option>
                                <option value="2010" ?selected="${this.uploadDecade === '2010'}">Десятые</option>
                             </select>` : ''}
                         
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                        html`<u-round-button
                                type="remove"
                                class="remove"
                                ?disabled="${this._isFetching || this._isUpdating}"
                                @click="${(e) => this.remove(e)}"></u-round-button>` : ''}
                         
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                        html`<u-round-button
                                type="submit"
                                class="submit"
                                ?disabled="${this._isFetching || this._isUpdating}"
                                @click="${(e) => this.submit(e)}"></u-round-button>  ` : ''}
                  
                    ${this._dot.activeImage && this._dot.activeDecade ?
                        html`<img src="https://urussu.s3.amazonaws.com/${this._dot.activeImage}" width="100" @click="${() => this.deleteImage(this._dot.activeDecade)}" alt="">` : ``}
                    
                  </div>
              
                  <div class="comments">
                      <u-comments origin-type="dot" origin-id="${this.dotId}"></u-comments>
                  </div>
                  
                  <div class="timeline">
                    ${[1940,1950,1960,1970,1980,1990,2000,2010].map(decade => {
                        return html`<div 
                                        class="decade ${this.isDecadeActive(decade) ? 'decade--active' : ''}"
                                        @click="${(e) => this.changeImage(e, decade)}">${decade}</div>`;    
                    })}
                  </div>
            </div>` : 'Dot not found'}
      </div>`
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._user = state.app.user;
        this._dot = state.dotPage.dot;

        // form state being fetched once from store
        // after that it is internal and not reflected to store
        this.title = state.dotPage.dot.title;
        this.shortDescription = state.dotPage.dot.shortDescription;

        this._isFetching = state.dotPage.isFetching;
        this._isUpdating = state.dotPage.isUpdating;
        this._isLoadingError = state.dotPage.isLoadingError;
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
        store.dispatch(setCloudsVisibility('full'));
        store.dispatch(fetchDot(this.dotId));
    }

    _setReferences() {
        this.$dotTitle = this.shadowRoot.querySelector('#dot-title');
        this.$shortDescription = this.shadowRoot.querySelector('#dot-short-description');
    }

    _setListeners() {

    }

    _setDefaults() {
        this.title = '';
        this.shortDescription = '';
        this.uploadDecade = '2010';
    }

    /*
        List of custom component's methods
        Any other methods
    */
    close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearDotState());
        this.dispatchEvent(new CustomEvent('hide-dot', {composed: true}));
    }

    submit(e) {
        e.preventDefault();

        let updatedDot = {
            ...this._dot,
            title: this.$dotTitle.value,
            shortDescription: this.$shortDescription.value
        };

        store.dispatch(putDot(updatedDot, this.dotId));
        this.close();
    }

    remove() {
        store.dispatch(deleteDot(this.dotId));
        this.close();
    }

    deleteImage(date) {
        store.dispatch(deletePhoto('dot', this.dotId, date));
    }

    changeUploadDecade(e) {
        this.uploadDecade = e.target.value;
    }

    isDotAuthor(user) {
        return user.id === this._dot.authorId;
    }

    isDecadeActive(decade) {
        return this._dot.images && this._dot.images[decade];
    }

    changeImage(e, decade) {
        if (e.target.classList.contains('decade--active')) {
            store.dispatch(changeActiveImage(this._dot.images[decade], decade));
        }
    }
}

window.customElements.define('u-dot', UDot);
