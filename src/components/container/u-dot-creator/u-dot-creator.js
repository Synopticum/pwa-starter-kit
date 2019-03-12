import { html, LitElement } from 'lit-element';
import { SharedStyles } from '../../shared-styles.js';

import { store } from '../../../store';
import { connect } from 'pwa-helpers/connect-mixin';
import { putDot } from '../u-dot/redux';
import {toggleDotCreator, updateForm, map, setCloudsVisibility} from '../u-map/redux';
store.addReducers({ map });

class UDotCreator extends connect(store)(LitElement) {

  static get properties() {
    return {
      x: {
        type: Number
      },
      y: {
        type: Number
      },
      lat: {
        type: Number
      },
      lng: {
        type: Number
      },

      _user: {
        type: Object
      },
      _title: {
        type: String,
        attribute: false
      },
      _layer: {
        type: String,
        attribute: false
      },
      _type: {
        type: String,
        attribute: false
      }
    };
  }

  constructor() {
    super();
  }

  render() {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
            position: fixed;
            left: ${this.x}px;
            top: ${this.y}px;
            padding: 10px;
            z-index: 200;
            width: 100%;
            max-width: 300px;
            transform: scale(1);
            transition: transform .3s;
            border: 3px solid #6B9B29;
            border-radius: 3px;
            background-color: #f9f9f9;
            box-shadow: 4px 4px 4px rgba(0,0,0,.15);
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
        }
        
        @keyframes bounce { 
          0% {transform: scale(.2);}
          50% {transform: scale(1);}
        }
        
        .bounce {
            content: '';
            position: absolute;
            left: -7.5px;
            top: -7.5px;
            width: 15px;
            height: 15px;
            background-color: #f00;
            border-radius: 50%;
            user-select: none;
            animation: bounce 1s alternate infinite linear;
        }
        
        .cancel {
            cursor: pointer;
            position: absolute;
            right: 20px;
            bottom: -15px;
            width: 30px;
            height: 30px;
            border: 0;
            outline: none;
            background: url("static/images/close.svg") no-repeat 50% 50% #fff;
            border-radius: 50%;
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
            margin: 5px 0;
            width: 100%;
            border: 0;
        }
      </style>
      
      <div class="create">
        <div class="bounce"></div>
        
        <input 
            type="text" 
            class="textbox"
            .value="${this._title}" 
            @input="${UDotCreator._inputTitle.bind(this)}" 
            placeholder="Введите название точки"><br>
        
        <div class="advanced-controls" ?hidden="${!this._user.isAdmin}"">
          <select @change="${UDotCreator._changeLayer.bind(this)}">
              <option value="official" ?selected="${this._type === 'official'}">Official</option>
              <option value="non-official" ?selected="${this._type === 'non-official'}">Non-official</option>
          </select>
          
          <select @change="${UDotCreator._changeType.bind(this)}">
              <option value="global" ?selected="${this._type === 'global'}">Global</option>
              <option value="local" ?selected="${this._type === 'local'}">Local</option>
          </select>
        </div>
        
        <button class="cancel" type="button" @click="${this._cancel.bind(this)}"></button>
        <button class="submit" type="submit" @click="${this._create.bind(this)}"></button>
      </div>
    `;
  }

  stateChanged(state) {
    this._user = state.app.user;
    this._title = state.map.dotCreator.title;
    this._layer = state.map.dotCreator.layer;
    this._type = state.map.dotCreator.type;
  }

  _create() {
    let dot = new Dot({
      title: this._title,
      layer: this._layer,
      type: this._type,
      coordinates: [this.lat, this.lng]
    });

    store.dispatch(putDot(dot));
    store.dispatch(toggleDotCreator(false, { x: this.x, y: this.y }));
    store.dispatch(updateForm({ title: '', layer: 'official', type: 'global' }));
    store.dispatch(setCloudsVisibility('none'));
  }

  _cancel() {
    store.dispatch(toggleDotCreator(false, { x: this.x, y: this.y }));
    store.dispatch(setCloudsVisibility('none'));
  }

  static _inputTitle(e) {
    store.dispatch(updateForm({ title: e.currentTarget.value }));
  }

  static _changeLayer(e) {
    store.dispatch(updateForm({ layer: e.currentTarget.value }));
  }

  static _changeType(e) {
    store.dispatch(updateForm({ type: e.currentTarget.value }));
  }
}

class Dot {
  constructor(options) {
    this.id = uuidv4();
    this.title = options.title;
    this.layer = options.layer;
    this.type = options.type;
    this.coordinates = options.coordinates;
  }
}

window.customElements.define('u-dot-creator', UDotCreator);
