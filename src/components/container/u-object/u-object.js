import { html, LitElement } from 'lit-element';
import { SharedStyles } from '../../shared-styles.js';

import { store } from '../../../store';
import { connect } from 'pwa-helpers/connect-mixin';
import { putObject, getObject, objectPage, cleanObjectState } from './redux';
import {setCloudsVisibility} from "../u-map/redux";
store.addReducers({ objectPage });

class UObject extends connect(store)(LitElement) {

  static get properties() {
    return {
      objectId: {
        type: Object
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
            width: 900px;
            background-color: #fff;
            z-index: 200;
            pointer-events: all;
            transform: scale(1);
            transition: transform .3s;
            padding: 30px;
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
        
        #object-title {
            font-size: 24px;
            background-color: rgba(0,0,0,.1);
            margin-bottom: 3px;
        }
        
        #object-address {
            font-size: 16px;
            font-style: italic;
            background-color: rgba(0,0,0,.1);
        }
        
        #object-short-description {
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
            background-color: rgba(0,0,0,.1);
        }
        
        #object-full-description {
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
            background-color: rgba(0,0,0,.1);
        }
        
        #object-title[data-fetching],
        #object-address[data-fetching],
        #object-short-description[data-fetching],
        #object-full-description[data-fetching] {
            color: #ccc;
        }
      </style>
      
      <div class="object">
        <div class="close" @click="${UObject.close}"></div>
        
        <div class="wrapper">
          <form class="form">
              <div id="object-title" 
                   ?data-fetching="${this._isUpdating}" 
                   ?contentEditable="${this._user.isAdmin}">${this._object.title ? this._object.title : ''}</div>
                   
              <div id="object-address" 
                   ?data-fetching="${this._isUpdating}" 
                   ?contentEditable="${this._user.isAdmin}">${this._object.address ? this._object.address : ''}</div>
                   
              <div id="object-short-description" 
                   ?data-fetching="${this._isUpdating}" 
                   ?contentEditable="${this._user.isAdmin}">${this._object.shortDescription ? this._object.shortDescription : ''}</div>
                   
              <div id="object-full-description" 
                   ?data-fetching="${this._isUpdating}" 
                   ?contentEditable="${this._user.isAdmin}">${this._object.fullDescription ? this._object.fullDescription : ''}</div>
              <hr>
              
              <button class="submit" type="submit" @click="${this._submit.bind(this)}"></button>
          </form>
          
          <div class="comments">
              <u-comments origin-type="object" origin-id="${this.objectId}"></u-comments>
          </div>
        </div>
      </div>
    `
  }

  stateChanged(state) {
    this._user = state.app.user;
    this._object = state.objectPage.object;
    this._isUpdating = state.objectPage.isUpdating;
    this._isFetching = state.objectPage.isFetching;
  }

  firstUpdated() {
    store.dispatch(setCloudsVisibility('full'));
    store.dispatch(getObject(this.objectId));

    // _create references to the inputs
    this.$form = this.shadowRoot.querySelector('.form');
    this.$objectTitle = this.shadowRoot.querySelector('#object-title');
    this.$objectAddress = this.shadowRoot.querySelector('#object-address');
    this.$objectShortDescription = this.shadowRoot.querySelector('#object-short-description');
    this.$objectFullDescription = this.shadowRoot.querySelector('#object-full-description');
  }

  disconnectedCallback() {
    store.dispatch(cleanObjectState());
  }

  static close() {
    store.dispatch(setCloudsVisibility('none'));
    this.dispatchEvent(new CustomEvent('hide', { composed: true }));
  }

  _submit(e) {
    e.preventDefault();

    if (this._object._id && this.$form.checkValidity()) {
      let objectId = this._object._id;
      let updatedObject = Object.assign(this._object, {
        title: this.$objectTitle.textContent.trim(),
        address: this.$objectAddress.textContent.trim(),
        shortDescription: this.$objectShortDescription.textContent.trim(),
        fullDescription: this.$objectFullDescription.textContent.trim()
      });

      store.dispatch(putObject(updatedObject, objectId));
    } else {
      alert('error!');
    }
  }
}

window.customElements.define('u-object', UObject);
