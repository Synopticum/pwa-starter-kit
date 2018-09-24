import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import { getObjectInfoById, hideObjectInfo, updateObject } from '../../../actions/object';

import object from '../../../reducers/object';
store.addReducers({
  object
});

class UObjectInfo extends connect(store)(LitElement) {

  constructor() {
    super();
    this.activeObject = {};
  }

  static get properties() {
    return {
      activeObject: {
        type: Object,
        attribute: false
      },
      saveState: {
        type: String,
        attribute: false
      },
      isFetching: {
        type: Boolean,
        attribute: false
      },
      isUpdating: {
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
        <div class="close" @click="${UObjectInfo.close}"></div>
        
        <form>
            <div id="object-title" 
                 ?data-fetching="${this.isUpdating}" 
                 ?contentEditable="${this.user.isAdmin}">${this.activeObject.title ? this.activeObject.title : 'Название объекта'}</div>
                 
            <div id="object-address" 
                 ?data-fetching="${this.isUpdating}" 
                 ?contentEditable="${this.user.isAdmin}">${this.activeObject.address ? this.activeObject.address : 'Адрес объекта'}</div>
                 
            <div id="object-short-description" 
                 ?data-fetching="${this.isUpdating}" 
                 ?contentEditable="${this.user.isAdmin}">${this.activeObject.shortDescription ? this.activeObject.shortDescription : 'Краткое описание'}</div>
                 
            <div id="object-full-description" 
                 ?data-fetching="${this.isUpdating}" 
                 ?contentEditable="${this.user.isAdmin}">${this.activeObject.fullDescription ? this.activeObject.fullDescription : 'Полное описание'}</div>
            <hr>
            
            <button class="submit" type="submit" @click="${this.submit.bind(this)}"></button>
        </form>
      </div> 
    `
  }

  _stateChanged(state) {
    this.user = state.user;
    this.activeObject = state.object.activeObject;
    this.saveState = state.object.saveState;
    this.isUpdating = state.object.isUpdating;
  }

  firstUpdated() {
    // create references to the inputs
    this.form = this.shadowRoot.querySelector('form');
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

    if (this.activeObject._id && this.form.checkValidity()) {
      let objectId = this.activeObject._id;
      let updatedObject = Object.assign(this.activeObject, {
        title: this.objectTitle.textContent.trim(),
        address: this.objectAddress.textContent.trim(),
        shortDescription: this.objectShortDescription.textContent.trim(),
        fullDescription: this.objectFullDescription.textContent.trim()
      });

      store.dispatch(updateObject(updatedObject, objectId));
    } else {
      alert('error!');
    }
  }
}

window.customElements.define('u-object-info', UObjectInfo);
