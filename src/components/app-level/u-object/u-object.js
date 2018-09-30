import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';

import { store } from '../../../store';
import { connect } from 'pwa-helpers/connect-mixin';
import { hideObjectInfo, putObject, objectPage } from './redux';
store.addReducers({ objectPage });

class UObject extends connect(store)(LitElement) {

  constructor() {
    super();
    this._object = {};
  }

  static get properties() {
    return {
      _user: {
        type: Object,
        attribute: false
      },
      _object: {
        type: Object,
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
            height: 600px;
            background-color: #fee;
            border: 1px solid green;
            z-index: 200;
            pointer-events: all;
            transform: scale(1);
            transition: transform .3s;
            padding: 30px;
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
            background-color: #ff0000;
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
            background-color: #00bb00;
        }
        
        #object-title {
            font-size: 24px;
        }
        
        #object-address {
            font-size: 16px;
            font-style: italic;
        }
        
        #object-short-description {
            border-top: 1px solid #ccc;
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
        }
        
        #object-full-description {
            border-top: 1px solid #ccc;
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
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
          <div class="form">
              <div id="object-title" 
                   ?data-fetching="${this._isUpdating}" 
                   ?contentEditable="${this._user.isAdmin}">${this._object.title ? this._object.title : 'Название объекта'}</div>
                   
              <div id="object-address" 
                   ?data-fetching="${this._isUpdating}" 
                   ?contentEditable="${this._user.isAdmin}">${this._object.address ? this._object.address : 'Адрес объекта'}</div>
                   
              <div id="object-short-description" 
                   ?data-fetching="${this._isUpdating}" 
                   ?contentEditable="${this._user.isAdmin}">${this._object.shortDescription ? this._object.shortDescription : 'Краткое описание'}</div>
                   
              <div id="object-full-description" 
                   ?data-fetching="${this._isUpdating}" 
                   ?contentEditable="${this._user.isAdmin}">${this._object.fullDescription ? this._object.fullDescription : 'Полное описание'}</div>
              <hr>
              
              <button class="submit" type="submit" @click="${this.submit.bind(this)}"></button>
          </div>
          
          <div class="comments">
              <u-comments type="object" id="${this._object._id}"></u-comments>
          </div>
        </div>
      </div>
    `
  }

  _stateChanged(state) {
    this._user = state.app.user;
    this._object = state.objectPage.object;
    this._isUpdating = state.objectPage.isUpdating;
  }

  firstUpdated() {
    // create references to the inputs
    this.objectTitle = this.shadowRoot.querySelector('#object-title');
    this.objectAddress = this.shadowRoot.querySelector('#object-address');
    this.objectShortDescription = this.shadowRoot.querySelector('#object-short-description');
    this.objectFullDescription = this.shadowRoot.querySelector('#object-full-description');
  }

  static close() {
    store.dispatch(hideObjectInfo());
  }

  submit(e) {
    e.preventDefault();

    if (this._object._id && this.form.checkValidity()) {
      let objectId = this._object._id;
      let updatedObject = Object.assign(this._object, {
        title: this.objectTitle.textContent.trim(),
        address: this.objectAddress.textContent.trim(),
        shortDescription: this.objectShortDescription.textContent.trim(),
        fullDescription: this.objectFullDescription.textContent.trim()
      });

      store.dispatch(putObject(updatedObject, objectId));
    } else {
      alert('error!');
    }
  }

  addComment(e) {
    debugger;
  }
}

window.customElements.define('u-object', UObject);
