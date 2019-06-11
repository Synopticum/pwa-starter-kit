import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import { repeat } from 'lit-element/node_modules/lit-html/directives/repeat';
import {fetchDot, putDot, clearDotState, deleteDot, setActiveImage} from './UDot.actions';
import {setCloudsVisibility} from '../u-map/UMap.actions';
import {dotPage} from "../../reducers/Dot.reducer";
import defer from 'lodash-es/defer';
import {deletePhoto} from "../u-photo-upload/UPhotoUpload.actions";
import {isAdmin, isAnonymous} from "../u-app/UApp.helpers";
import '../u-textbox/UTextbox';
import '../u-round-button/URoundButton';
import '../u-button/UButton';
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

            areCommentsVisible: {
                type: Boolean,
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

            _activeImage: {
                type: String,
                attribute: false
            },

            _activeDecade: {
                type: String,
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
            width: 95%;
            height: 95%;
            max-width: 1920px;
            z-index: 200;
            pointer-events: all;
            transform: scale(1);
            transition: transform .3s;
            border-radius: 3px;
            background-color: #111;
            box-shadow: 4px 4px 4px rgba(0,0,0,.15);
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
            width: 0;
            height: 0;
        }
        
        :host::before {
            position: absolute;
            left: 50%;
            top: 50%;
            color: #ffffff;
            transform: translate(-50%,-50%);
            content: 'Фотографии отсутствуют';
            font-size: 18px;
        }
        
        .close, .open-comments {
            position: absolute;
            right: 20px;
            top: 20px;
            z-index: 175;
        }
        
        .open-comments {
            top: 19px;
            right: 70px;
        }
        
        .u-dot {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }
        
        .form {
            position: relative;
            z-index: 150;
            padding: 15px 20px;
            background-color: rgba(0,0,0,.75);
        }
        
        .comments {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 200;
            width: 300px;
            padding: 20px;
            height: 100%;
            box-sizing: border-box;
            background-color: rgba(255,255,255,.95);
        }
        
        .hide-comments {
            cursor: pointer;
            position: absolute;
            left: -37px;
            top: 50%;
            width: 30px;
            height: 40px;
            background: url('static/images/button-icons/hide-comments.svg') no-repeat 50% 50% rgba(255,255,255,.95);
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        #dot-title {
          width: 100%;
          padding-left: 0;
            --font-size: 24px;
            --selection-color: rgba(255,255,255,.8);
            --font-weight: rgba(255,255,255,0);
        }
        
        .image {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 50;
            background: url('https://urussu.s3.amazonaws.com/${this._activeImage}') no-repeat 50% 50%;
            background-size: cover;
        }
        
        .timeline {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 100;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
        }
        
        .decade {
            cursor: pointer;
            padding: 5px 10px;
            background-color: rgba(255,255,255,.9);
            color: #000000;
            border-radius: 20px;
            opacity: .5;
            margin: 5px 10px;
            transition: background-color .2s;
        }
        
        .decade--active {
            opacity: 1;
        }
        
        .decade--active:hover {
            background-color: #eeeeee;
        }
        
        .controls {
            position: absolute;
            z-index: 150;
            width: 100%;
            box-sizing: border-box;
            left: 0;
            bottom: 0;
            padding: 20px;
            background-color: rgba(0,0,0,.75);
            display: flex;
            justify-content: space-between;
        }
        
        .controls__dot {
            display: flex;
        }
        
        .remove {
            --border-radius: 15px 0 0 15px;
        }
        
        .submit {
            --border-radius: 0 15px 15px 0;
        }
        
        .controls__photo {
            display: flex;
        }
        
        .delete-image {
            --border-radius: 15px 0 0 15px;
        }
      </style>
      
      <div class="u-dot">
        <div class="close">
            <u-round-button type="close" @click="${this.close}"></u-round-button>
        </div>
        
        ${!this._isLoadingError ?
          html`<div class="wrapper">
                  <div class="open-comments">
                    <u-round-button type="open-comments" @click="${this.toggleComments}"></u-round-button>
                  </div>
                  
                  <div class="image"></div>
                  
                  <div class="timeline">
                    ${this._dot.images && this._activeDecade ? Object.entries(this._dot.images).map(decade => {
                        return html`<div 
                                        class="decade ${decade[0] === this._activeDecade ? 'decade--active' : ''}"
                                        @click="${e => this.changeImage(e, decade[0])}">${decade[0]}</div>`;    
                    }): ''}
                  </div>  
                  
                  <div class="form">
                    <u-textbox
                         type="default"
                         id="dot-title"
                         ?is-fetching="${this._isFetching}" 
                         ?is-updating="${this._isUpdating}" 
                         ?disabled="${isAnonymous(this._user) || (!this.isDotAuthor(this._user) && !isAdmin(this._user))}"
                         value="${this.title || ''}"
                         placeholder="Введите название"></u-textbox>     
                  </div>
                  
                  ${isAdmin(this._user) ? html`
                      <div class="controls">
                          <div class="controls__photo">
                              ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) && this._activeImage ?
                                      html`<u-button
                                              class="delete-image"
                                              type="danger"
                                              ?disabled="${this._isFetching || this._isUpdating}"
                                              @click="${() => this.deleteImage(this._activeDecade)}">Удалить фото</u-button>` : ''}
                              
                              ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                                  html`<u-photo-upload 
                                          type="dot"
                                          ?disabled="${this._isFetching || this._isUpdating}"
                                          id="${this.dotId}"></u-photo-upload>` : ''}
                          </div>
                             
                          <div class="controls__dot">
                              ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                                  html`<u-button
                                          class="remove"
                                          type="danger"
                                          ?disabled="${this._isFetching || this._isUpdating}"
                                          @click="${(e) => this.remove(e)}">Удалить</u-button>` : ''}
                                 
                              ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                                  html`<u-button
                                          class="submit"
                                          type="regular"
                                          ?disabled="${this._isFetching || this._isUpdating}"
                                          @click="${(e) => this.submit(e)}">Сохранить</u-button>  ` : ''}
                          </div>
                      </div>` : ''}
              
                  ${this.areCommentsVisible ?
                      html`<div class="comments">
                            <div class="hide-comments" @click="${this.toggleComments}"></div>
                           
                            <u-comments origin-type="dot" origin-id="${this.dotId}"></u-comments>
                      </div>` : ''}
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

        this._activeImage = state.dotPage.activeImage;
        this._activeDecade = state.dotPage.activeDecade;

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
        this.areCommentsVisible = false;
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

    isDotAuthor(user) {
        return user.id === this._dot.authorId;
    }

    isDecadeActive(decade) {
        return this._dot.images && this._dot.images[decade];
    }

    changeImage(e, decade) {
        store.dispatch(setActiveImage(decade, this._dot.images[decade]));
    }

    toggleComments() {
        this.areCommentsVisible = !this.areCommentsVisible;
    }
}

window.customElements.define('u-dot', UDot);
