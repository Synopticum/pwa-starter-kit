import {html, LitElement} from 'lit-element/lit-element';

import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {fetchDot, putDot, clearDotState} from './UDot.actions';
import {setCloudsVisibility} from '../u-map/UMap.actions';
import {dotPage} from "../../reducers/Dot.reducer";
import defer from 'lodash-es/defer';

store.addReducers({dotPage});

class UDot extends connect(store)(LitElement) {

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
            _isValid: {
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
        }
        
        .form {
            flex: 2;
        }
        
        .comments {
            margin-left: 20px;
            flex: 1;
        }
        
        .submit {
            position: absolute;
            right: -15px;
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
      </style>
      
      <div class="dot">
        <u-round-button type="close" class="close" @click="${UDot.close}"></u-round-button>  
        
        <div class="wrapper">
          <div class="form">
            <u-textbox
                 type="default"
                 id="dot-title"
                 ?is-updating="${this._isUpdating}" 
                 ?disabled="${!this._user.isAdmin}"
                 value="${this.title ? this.title : ''}"
                 @keyup="${this.validate}"
                 placeholder="Введите название точки"></u-textbox>
                 
            <u-textbox
                 type="default"
                 id="dot-short-description"
                 ?is-updating="${this._isUpdating}" 
                 ?disabled="${!this._user.isAdmin}"
                 value="${this.shortDescription ? this.shortDescription : ''}"
                 placeholder="Введите краткое описание"></u-textbox>
                 
            <u-round-button
                type="submit"
                class="submit"
                ?disabled="${!this._isValid}"
                @click="${this.submit.bind(this)}"></u-round-button>  
          </div>
          
          <div class="comments">
              <u-comments origin-type="dot" origin-id="${this.dotId}"></u-comments>
          </div>
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

        // form state being fetched once from store
        // after that it is internal and not reflected to store
        this.title = state.dotPage.dot.title;
        this.shortDescription = state.dotPage.dot.shortDescription;

        this._isUpdating = state.dotPage.isUpdating;
        this._isFetching = state.dotPage.isFetching;

        defer(this.validate.bind(this));
    }

    firstUpdated() {
        this._init();
        this._setReferences();
    }

    static close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearDotState());
        this.dispatchEvent(new CustomEvent('hide', {composed: true}));
    }

    validate() {
        this.$dotTitle.value ? this._isValid = true : this._isValid = false;
    }

    submit(e) {
        e.preventDefault();

        let updatedDot = {
            ...this._dot,
            title: this.$dotTitle.value,
            shortDescription: this.$shortDescription.value
        };

        store.dispatch(putDot(updatedDot, this.dotId));
    }

    _init() {
        store.dispatch(setCloudsVisibility('full'));
        store.dispatch(fetchDot(this.dotId));
    }

    _setDefaults() {
        this._isValid = false;

        this.title = '';
        this.shortDescription = '';
    }

    _setReferences() {
        this.$dotTitle = this.shadowRoot.querySelector('#dot-title');
        this.$shortDescription = this.shadowRoot.querySelector('#dot-short-description');
    }
}

window.customElements.define('u-dot', UDot);
