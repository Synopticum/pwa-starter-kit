import { html, LitElement } from 'lit-element';
import { SharedStyles } from '../../shared-styles.js';

import { store } from '../../../store';
import { connect } from 'pwa-helpers/connect-mixin';
import { getDot, putDot, dotPage } from './redux';
import { clearDotState } from '../u-dot/redux';
import { setCloudsVisibility } from '../u-map/redux';
store.addReducers({ dotPage });

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
      fullDescription: {
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
      
      ${SharedStyles}
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
            cursor: pointer;
            position: absolute;
            right: -15px;
            top: -15px;
            width: 30px;
            height: 30px;
            background: url("static/images/close.svg") no-repeat 50% 50% #fff;
            border-radius: 50%;
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
            cursor: pointer;
            position: absolute;
            right: -15px;
            bottom: -15px;
            width: 30px;
            height: 30px;
            border: 0;
            outline: none;
            background: url("static/images/ok.svg") no-repeat 50% 50% #fff;
            border-radius: 50%;
        }
        
        .submit:disabled {
            cursor: not-allowed;
            opacity: .3;
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
        <div class="close" @click="${UDot.close}"></div>        
        
        <div class="wrapper">
          <form class="form">
            <u-textbox
                 id="dot-title"
                 ?is-updating="${this._isUpdating}" 
                 ?disabled="${!this._user.isAdmin}"
                 value="${this.title ? this.title : ''}"
                 @keyup="${this._validate}"
                 placeholder="Введите название точки"></u-textbox>
                 
            <u-textbox
                 id="dot-short-description"
                 ?is-updating="${this._isUpdating}" 
                 ?disabled="${!this._user.isAdmin}"
                 value="${this.shortDescription ? this.shortDescription : ''}"
                 placeholder="Введите краткое описание"></u-textbox>
                 
            <u-textbox
                 hidden
                 id="dot-full-description"
                 ?is-updating="${this._isUpdating}" 
                 ?disabled="${!this._user.isAdmin}"
                 value="${this.fullDescription ? this.fullDescription : ''}"
                 placeholder="Введите полное описание"></u-textbox>
            
            <button 
                class="submit" 
                type="submit"
                ?disabled="${!this._isValid}" 
                @click="${this._submit.bind(this)}"></button>
          </form>
          
          <div class="comments">
              <u-comments origin-type="dot" origin-id="${this.dotId}"></u-comments>
          </div>
        </div>
      </div> 
    `
  }

  constructor() {
    super();
    this._isValid = false;

    this.title = '';
    this.shortDescription = '';
    this.fullDescription = '';
  }

  stateChanged(state) {
    this._user = state.app.user;
    this._dot = state.dotPage.dot;

    // form state being fetched once from store
    // after that it is internal and not reflected to store
    this.title = state.dotPage.dot.title;
    this.shortDescription = state.dotPage.dot.shortDescription;
    this.fullDescription = state.dotPage.dot.fullDescription;

    this._isUpdating = state.dotPage.isUpdating;
    this._isFetching = state.dotPage.isFetching;

    _.defer(this._validate.bind(this));
  }

  firstUpdated() {
    store.dispatch(setCloudsVisibility('full'));
    store.dispatch(getDot(this.dotId));

    // _create references to the inputs
    this.$dotTitle = this.shadowRoot.querySelector('#dot-title');
    this.$shortDescription = this.shadowRoot.querySelector('#dot-short-description');
    this.$fullDescription = this.shadowRoot.querySelector('#dot-full-description');
  }

  disconnectedCallback() {
    store.dispatch(clearDotState());
  }

  static close() {
    store.dispatch(setCloudsVisibility('none'));
    this.dispatchEvent(new CustomEvent('hide', { composed: true }));
  }

  _validate() {
    this.$dotTitle.value ? this._isValid = true : this._isValid = false;
  }

  _submit(e) {
    e.preventDefault();

    let updatedDot = {
      ...this._dot,
      title: this.$dotTitle.value,
      shortDescription: this.$shortDescription.value,
      fullDescription: this.$fullDescription.value
    };

    store.dispatch(putDot(updatedDot, this.dotId));
  }
}

window.customElements.define('u-dot', UDot);
