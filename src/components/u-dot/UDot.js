import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {fetchDot, putDot, clearDotState, deleteDot, setActiveImage} from './UDot.actions';
import {setCloudsVisibility} from '../u-map/UMap.actions';
import {dotPage} from "../../reducers/Dot.reducer";
import {deletePhoto} from "../u-photo-upload/UPhotoUpload.actions";
import {isAdmin, isAnonymous} from "../u-app/UApp.helpers";
import '../u-textbox/UTextbox';
import '../u-round-button/URoundButton';
import '../u-button/UButton';
import '../u-comments/UComments';
import '../u-photo-upload/UPhotoUpload';
import {fetchComments} from "../u-comments/UComments.actions";

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

            areCommentsVisible: {
                type: Boolean,
                attribute: false
            },

            _comments: {
                type: Array,
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
        
        @media screen and (max-width: 1280px) {
            :host {
                width: 100%;
                height: 100%;
            }        
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
            width: 0;
            height: 0;
        }
        
        .close, .open-comments {
            position: absolute;
            right: 20px;
            top: 20px;
            z-index: 175;
            background-color: rgba(0,0,0,.5);
            padding: 10px 10px 7px 10px;
            border-radius: 50%;
        }
        
        .open-comments {
            right: 80px;
        }
        
        .open-comments__count {
            position: absolute;
            right: 0;
            top: 0;
            background: #f00;
            color: #ffffff;
            padding: 0 3px;
            font-size: 14px;
            border-radius: 10px;
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
        
        .image {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 50;
            background: url('https://urussu.s3.amazonaws.com/${this._activeImage}') no-repeat 50% 50%;
            background-size: contain;
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
        
        .controls__label {
            display: flex;
        }
        
        .controls__type {
            display: flex;
        }
        
        .select-type, .select-label {
            margin: 0 10px;
        }
        
        .controls__dot {
            display: flex;
        }
        
        .remove {
            --border-radius: 15px;
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
                    ${this._comments.length ? html`<div class="open-comments__count">${this._comments.length}</div>` : ``}
                    <u-round-button type="open-comments" @click="${this.toggleComments}"></u-round-button>
                  </div>
                  
                  <div class="image"></div>
                  
                  <div class="timeline">
                    ${this._dot.images && this._activeDecade ? Object.entries(this._dot.images).map(decade => {
                        return html`<div 
                                        class="decade ${decade[0] === this._activeDecade ? 'decade--active' : ''}"
                                        @click="${e => this.changeImage(e, decade[0])}">${this.decadeLabels[decade[0]]}</div>`;    
                    }): ''}
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
                                <option value="old-only" ?selected="${this._dot.type === 'old-only'}">Только старое</option>
                                <option value="new-only" ?selected="${this._dot.type === 'new-only'}">Только новое</option>
                            </select>
                          </div>
                             
                          <div class="controls__dot">
                              ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                                  html`<u-button
                                          class="remove"
                                          type="danger"
                                          ?disabled="${this._isFetching || this._isUpdating}"
                                          @click="${(e) => this.remove(e)}">Удалить точку</u-button>` : ''}
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

        this._comments = state.comments.dotPage.items;

        this._activeImage = state.dotPage.activeImage;
        this._activeDecade = state.dotPage.activeDecade;

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
        store.dispatch(fetchComments('dot', this.dotId));
    }

    _setReferences() {

    }

    _setListeners() {

    }

    _setDefaults() {
        this.areCommentsVisible = false;
        this.decadeLabels = {
            1940: 'Сороковые',
            1950: 'Пятидесятые',
            1960: 'Шестидесятые',
            1970: 'Семидесятые',
            1980: 'Восьмидесятые',
            1990: 'Девяностые',
            2000: 'Нулевые',
            2010: 'Десятые'
        };
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
        // this method was formerly used to update title and description
        // may be useful in the future
        e.preventDefault();

        let updatedDot = {
            ...this._dot
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
}

window.customElements.define('u-dot', UDot);
