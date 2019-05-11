import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {fetch, toggle} from './USmartTemplate.actions';
import {pieceOfState} from "../../reducers/USmartTemplate.reducer";

store.addReducers({pieceOfState});

export class USmartTemplate extends connect(store)(LitElement) {

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
        this._fetchDefaults();
        this._setReferences();
        this._setListeners();
    }

    _fetchDefaults() {
        store.dispatch(fetch());
    }

    _setDefaults() {

    }

    _setReferences() {
        this.$container = this.shadowRoot.querySelector('.u-smart-template');
    }

    _setListeners() {
        this.addEventListener('click', e => e.stopPropagation());
    }
}

window.customElements.define('u-smart-template', USmartTemplate);