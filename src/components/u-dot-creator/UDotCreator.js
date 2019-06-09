import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {putDot} from '../u-dot/UDot.actions';
import {toggleDotCreator, setCloudsVisibility} from '../u-map/UMap.actions';
import {map} from "../../reducers/Map.reducer";
import {isAdmin, isAnonymous} from "../u-app/UApp.helpers";
import '../u-textbox/UTextbox';
import '../u-round-button/URoundButton';

store.addReducers({map});

class UDotCreator extends connect(store)(LitElement) {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
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
          </style>
          
          <form class="form">
            <div class="bounce"></div>
            
            <div class="advanced-controls">
              Добавить точку сюда?
            </form>
            
            <u-round-button type="close" class="close" @click="${() => this.close()}"></u-round-button>  
            
            <u-round-button 
                type="submit" 
                class="submit" 
                @click="${(e) => this.create(e)}"></u-round-button>  
          </div>
    `;
    }

    stateChanged(state) {
        this._user = state.app.user;
    }

    firstUpdated() {
        this._init();
    }

    _init() {
        this._setStore();
        this._setReferences();
        this._setListeners();
    }

    _setStore() {

    }

    _setReferences() {

    }

    _setListeners() {
        this.addEventListener('click', e => e.stopPropagation());
    }

    _setDefaults() {

    }

    /*
        List of custom component's methods
        Any other methods
    */
    create(e) {
        e.preventDefault();

        let layerName = isAdmin(this._user) ? 'Official' : `${this._user.firstName} ${this._user.lastName}`;
        let layerType = isAdmin(this._user) ? 'OfficialDefault' : 'UserDefault';

        let dot = new Dot({
            layer: layerName,
            type: layerType,
            coordinates: [this.lat, this.lng],
            authorId: this._user.id
        });

        store.dispatch(putDot(dot));
        store.dispatch(toggleDotCreator(false, {x: this.x, y: this.y}));
        store.dispatch(setCloudsVisibility('none'));
    }

    close() {
        store.dispatch(toggleDotCreator(false, {x: this.x, y: this.y}));
        store.dispatch(setCloudsVisibility('none'));
    }
}

class Dot {
    constructor(options) {
        this.id = uuidv4();
        this.layer = options.layer;
        this.type = options.type;
        this.coordinates = options.coordinates;
        this.authorId = options.authorId;
    }
}

window.customElements.define('u-dot-creator', UDotCreator);
