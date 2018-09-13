import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import { hideObjectInfo, saveObject } from '../../../actions/object';

import object from '../../../reducers/object';
store.addReducers({
  object
});

class UObjectInfo extends connect(store)(LitElement) {

  static get properties() {
    return {
      activeObject: { type: Object },
      saveState: { type: String },
      isFetching: { type: Boolean },
      isUpdating: { type: Boolean }
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
        
        form {
            font-size: 0;
        }
        
        input[type="text"] {
            width: 300px;
            padding: 10px;
            margin: 10px 0;
        }
        
        textarea {
            width: 300px;
            height: 150px;
            padding: 10px;
            margin: 10px 0;
        }
      </style>
      
      <div class="object">
        <div class="close" @click="${UObjectInfo.close}"></div>
        
        <form>
            <input id="object-name" type="text" placeholder="Название объекта" required><br>
            <input id="object-address" type="text" placeholder="Адрес объекта" required><br>
            <textarea id="object-short-description" placeholder="Краткое описание" maxlength="200" required></textarea><br>
            <textarea id="object-full-description" placeholder="Полное описание"></textarea><br>
            
            <button class="submit" type="submit" @click="${this.submit.bind(this)}"></button>
        </form>
        
        <div class="zxvczxcv">
            ${this.saveState}<br>
            ${this.isUpdating ? 'updating' : ''}
        </div>
      </div> 
    `
  }

  _stateChanged(state) {
    this.user = state.user;
    this.activeObject = state.object.activeObject;
    this.saveState = state.object.saveState;
    this.isUpdating = state.object.isUpdating;
  }

  firstRendered() {
    // create references to the inputs
    this.form = this.shadowRoot.querySelector('form');
    this.objectName = this.shadowRoot.querySelector('#object-name');
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
      let object = {
        id: this.activeObject._id,
        name: this.objectName.value,
        address: this.objectAddress.value,
        shortDescription: this.objectShortDescription.value,
        fullDescription: this.objectFullDescription.value
      };

      store.dispatch(saveObject(object));
    } else {
      alert('error!');
    }
  }
}

window.customElements.define('u-object-info', UObjectInfo);
