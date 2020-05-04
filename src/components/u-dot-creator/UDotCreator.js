import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {putDot} from '../u-dot/UDot.actions';
import {setCloudsVisibility, toggleDotCreator} from '../u-map/UMap.actions';
import {map} from "../u-map/UMap.reducer";
import '../u-text-button/UTextButton';
import props from './UDotCreator.props';
import styles from './UDotCreator.styles';

store.addReducers({map});

class UDotCreator extends connect(store)(LitElement) {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return props;
    }

    static get styles() {
        return styles;
    }

    constructor() {
        super();
        this._setDefaults();
    }

    render() {
        return html`
          <style>
            :host {
                left: ${this.x}px;
                top: ${this.y}px;
            }
          </style>
          
          <div class="u-dot-creator">
              <form class="form">
                <div id="wrapper">
                    <div id="wrapper-inner">
                        <div id="scroll-down">
                            <span class="arrow-down"></span>
                        </div>
                    </div>
                </div>
                
                <div class="buttons">                    
                    <u-icon-button @click="${this.close}" icon="close"></u-icon-button>
                    <u-icon-button @click="${this.create}" icon="check"></u-icon-button>
                </div>
              </div>
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

        // let layerName = isAdmin(this._user) ? 'Official' : `${this._user.firstName} ${this._user.lastName}`;
        // let layerType = isAdmin(this._user) ? 'OfficialDefault' : 'UserDefault';

        let dot = new Dot({
            layer: '2020',
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
        this.instanceType = 'dot';
        this.layer = options.layer;
        this.coordinates = options.coordinates;
        this.authorId = options.authorId;
        this.images = {};
        this.rotationAngle = 0;
        this.title = '';
        this.shortDescription = '';
        this.fullDescription = '';
        this.thumbnail = '';
    }
}

window.customElements.define('u-dot-creator', UDotCreator);
