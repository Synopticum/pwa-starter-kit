import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {fetch, toggle} from './USmartTemplate.actions';
import {pieceOfState} from "../../reducers/USmartTemplate.reducer";

store.addReducers({pieceOfState});

export class USmartTemplate extends connect(store)(LitElement) {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return {
            propertyToReflectInTemplate: {
                type: String,
                attribute: false
            }
        }
    }

    render() {
        return html`      
          <style>
            :host {
            
            }
          </style>
          
          <div class="u-smart-template">
            <button @click="${() => toggle()}"></button>
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._pieceOfState = state.pieceOfState;
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
        store.dispatch(fetch());
    }

    _setReferences() {
        this.$container = this.shadowRoot.querySelector('.u-smart-template');
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
}

window.customElements.define('u-smart-template', USmartTemplate);