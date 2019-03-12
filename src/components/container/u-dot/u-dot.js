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

      _user: {
        type: Object
      },
      _isFetching: {
        type: Boolean,
        attribute: false
      },
      _isUpdating: {
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
            background-color: #fff;
            z-index: 200;
            pointer-events: all;
            transform: scale(1);
            transition: transform .3s;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 2px 2px 10px rgba(0,0,0,.3);
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
        
        .textbox {
            width: 100%;
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
        
        .textbox {
          padding-left: 0;
          border-color: transparent;
        }
        
        .textbox.textbox--empty {
        }
        
        #dot-title {
            font-size: 24px;
        }
        
        #dot-short-description {
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
        }
        
        #dot-full-description {
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
        }
        
        #dot-title[data-fetching],
        #dot-short-description[data-fetching],
        #dot-full-description[data-fetching] {
            color: #ccc;
        }
      </style>
      
      <div class="dot">
        <div class="close" @click="${UDot.close}"></div>        
        
        <div class="wrapper">
          <form class="form">
            <input 
                 class="textbox ${this._dot.title ? '' : 'textbox--empty'}" 
                 id="dot-title" 
                 ?data-fetching="${this._isUpdating}" 
                 ?disabled="${!this._user.isAdmin}"
                 value="${this._dot.title ? this._dot.title : ''}"
                 placeholder="Введите название точки">
                 
            <input 
                 class="textbox ${this._dot.shortDescription ? '' : 'textbox--empty'}" 
                 id="dot-short-description" 
                 ?data-fetching="${this._isUpdating}" 
                 ?disabled="${!this._user.isAdmin}"
                 value="${this._dot.shortDescription ? this._dot.shortDescription : ''}"
                 placeholder="Введите краткое описание">
                 
            <input 
                 class="textbox ${this._dot.fullDescription ? '' : 'textbox--empty'}" 
                 id="dot-full-description" 
                 ?data-fetching="${this._isUpdating}" 
                 ?disabled="${!this._user.isAdmin}"
                 value="${this._dot.fullDescription ? this._dot.fullDescription : ''}"
                 placeholder="Введите полное описание">
            
            <button class="submit" type="submit" @click="${this._submit.bind(this)}"></button>
          </form>
          
          <div class="comments">
              <u-comments origin-type="dot" origin-id="${this.dotId}"></u-comments>
          </div>
        </div>
      </div> 
    `
  }

  stateChanged(state) {
    this._user = state.app.user;
    this._dot = state.dotPage.dot;
    this._isUpdating = state.dotPage.isUpdating;
    this._isFetching = state.dotPage.isFetching;
  }

  firstUpdated() {
    store.dispatch(setCloudsVisibility('full'));
    store.dispatch(getDot(this.dotId));

    // _create references to the inputs
    this.$form = this.shadowRoot.querySelector('form');
    this.$dotTitle = this.shadowRoot.querySelector('#dot-title');
    this.$dotShortDescription = this.shadowRoot.querySelector('#dot-short-description');
    this.$dotFullDescription = this.shadowRoot.querySelector('#dot-full-description');
  }

  disconnectedCallback() {
    store.dispatch(clearDotState());
  }

  static close() {
    store.dispatch(setCloudsVisibility('none'));
    this.dispatchEvent(new CustomEvent('hide', { composed: true }));
  }

  _submit(e) {
    e.preventDefault();

    if (this._dot.id && this.$form.checkValidity()) {
      let dotId = this._dot.id;
      let updatedDot = Object.assign(this._dot, {
        title: this.$dotTitle.textContent.trim(),
        shortDescription: this.$dotShortDescription.textContent.trim(),
        fullDescription: this.$dotFullDescription.textContent.trim()
      });

      store.dispatch(putDot(updatedDot, dotId));
    } else {
      alert('error!');
    }
  }
}

window.customElements.define('u-dot', UDot);
