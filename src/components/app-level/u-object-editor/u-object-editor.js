import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import { hideObjectEditor } from '../../../actions/map.js';

import map from '../../../reducers/map.js';
store.addReducers({
  map
});

class UObjectEditor extends connect(store)(LitElement) {

  static get properties() {
    return {
      _object: String
    };
  }

  _render({ _object }) {
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
        <div class="close" on-click="${UObjectEditor.close}"></div>
        
        <form>
            <input type="text" placeholder="Название объекта" required><br>
            <input type="text" placeholder="Адрес объекта" required><br>
            <textarea placeholder="Краткое описание" maxlength="200" required></textarea><br>
            <textarea placeholder="Полное описание"></textarea><br>
            
            <button class="submit" type="submit" on-click="${this.submit.bind(this)}"></button>
        </form>
      </div> 
    `
  }

  constructor() {
    super();
    this._object = {};
  }

  _stateChanged(state) {
    this._object = state.map.object;
  }

  static close() {
    store.dispatch(hideObjectEditor());
  }

  submit(e) {
    let form = this.shadowRoot.querySelector('form');

    if (form.checkValidity()) {
      alert('submitted!');
    } else {
      alert('error!');
    }
    e.preventDefault();
  }
}

window.customElements.define('u-object-editor', UObjectEditor);
