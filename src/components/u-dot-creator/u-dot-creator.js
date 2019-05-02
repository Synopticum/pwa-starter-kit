import {html, LitElement} from 'lit-element/lit-element';

import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {putDot} from '../u-dot/redux';
import {toggleDotCreator, map, setCloudsVisibility} from '../u-map/redux';
import {navigate} from "../u-app/redux";

store.addReducers({map});

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

            _isValid: {
                type: Boolean,
                attribute: false
            }
        };
    }

    constructor() {
        super();
        this._setDefaults();
    }

    render() {
        return html`
          
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
              0% {transform: scale(.3);}
              50% {transform: scale(1.3);}
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
            
            .close {
                position: absolute;
                right: 20px;
                bottom: -15px;
            }
            
            .submit {
                position: absolute;
                right: -15px;
                bottom: -15px;
            }
            
            #dot-title {
                margin: 5px 0;
                width: 100%;
                border: 0;
            }
          </style>
          
          <form class="form">
            <div class="bounce"></div>
            
             <u-textbox
                type="default"
                id="dot-title"
                ?is-updating="${this._isUpdating}" 
                ?disabled="${!this._user.isAdmin}"
                value=""
                @keyup="${this.validate}"
                placeholder="Введите название точки"></u-textbox><br>
            
            <div class="advanced-controls" ?hidden="${!this._user.isAdmin}"">
              <select id="dot-layer">
                  <option value="official" selected>Official</option>
                  <option value="non-official">Non-official</option>
              </select>
              
              <select id="dot-type">
                  <option value="global" selected>Global</option>
                  <option value="local">Local</option>
              </select>
            </form>
            
            <u-round-button type="close" class="close" @click="${this.close.bind(this)}"></u-round-button>  
            
            <u-round-button 
                type="submit" 
                class="submit" 
                ?disabled="${!this._isValid}" 
                @click="${this.create.bind(this)}"></u-round-button>  
          </div>
    `;
    }

    firstUpdated() {
        this._setReferences();
    }

    stateChanged(state) {
        this._user = state.app.user;
    }

    create(e) {
        e.preventDefault();

        let dot = new Dot({
            title: this.$title.value,
            layer: this.$layer.value,
            type: this.$type.value,
            coordinates: [this.lat, this.lng]
        });

        store.dispatch(putDot(dot));
        store.dispatch(toggleDotCreator(false, {x: this.x, y: this.y}));
        store.dispatch(setCloudsVisibility('none'));

        this.resetState();
        store.dispatch(navigate(`/dots/${dot.id}`));
    }

    close() {
        store.dispatch(toggleDotCreator(false, {x: this.x, y: this.y}));
        store.dispatch(setCloudsVisibility('none'));
    }

    validate() {
        this.$title.value ? this._isValid = true : this._isValid = false;
    }

    resetState() {
        this.$title.value = '';
        this.$layer.value = 'official';
        this.$type.value = 'global';
    }

    _setDefaults() {
        this._isValid = false;
    }

    _init() {

    }

    _setReferences() {
        this.$title = this.shadowRoot.querySelector('#dot-title');
        this.$layer = this.shadowRoot.querySelector('#dot-layer');
        this.$type = this.shadowRoot.querySelector('#dot-type');
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
