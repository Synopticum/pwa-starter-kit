import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { store } from '../../../store';
import { putDot } from '../../../actions/dot';
import { toggleDotCreate } from '../../../actions/map';

class UDotCreate extends LitElement {

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
      }
    };
  }

  constructor() {
    super();
    this._title = 'test';
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
        <input type="text" value="${this._title}" @input="${this.onInput.bind(this)}" placeholder="Enter dot title"> <button type="submit" @click="${this.create.bind(this)}">ok</button>
      </div>
    `;
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
  }

  onInput(e) {
    this._title = e.currentTarget.value;
  }
}

window.customElements.define('u-dot-create', UDotCreate);
