import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { store } from '../../../store';
import { connect } from 'pwa-helpers/connect-mixin';

import { putDot } from '../../../actions/dot';
import { toggleDotCreate } from '../../../actions/map';
import { updateForm } from '../../../actions/create-dot';

import createDot from '../../../reducers/create-dot';
store.addReducers({
  createDot
});

class UDotCreate extends connect(store)(LitElement) {

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

      _title: {
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
            background-color: #ffffff;
            z-index: 200;
            border: 1px solid blue;
            transform: scale(1);
            transition: transform .3s;
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
        }
      </style>
      
      <div class="create">
        <input type="text" .value="${this._title}" @input="${UDotCreate.input.bind(this)}" placeholder="Enter dot title"> <button type="submit" @click="${this.create.bind(this)}">ok</button>
      </div>
    `;
  }

  _stateChanged(state) {
    this._title = state.createDot.title;
  }

  create() {
    let dot = {};
    let coordinates = [this.lat, this.lng];

    // setup dot
    dot.id = uuidv4();
    dot.title = this._title;
    dot.layer = 'default';
    dot.type = 'global';
    dot.coordinates = coordinates;

    store.dispatch(putDot(dot));
    store.dispatch(toggleDotCreate(false));
    store.dispatch(updateForm({ title: '' }));
  }

  static input(e) {
    store.dispatch(updateForm({ title: e.currentTarget.value }));
  }
}

window.customElements.define('u-dot-create', UDotCreate);
