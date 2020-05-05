import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {
    setCurrentDotId,
    toggleDotCreator,
} from '../u-map/UMap.actions';
import {fetch, toggle} from './UPage.actions';
import {pieceOfState} from "./UPage.reducer";
import props from './UPage.props';
import styles from './UPage.styles';
import visitedBefore from '../../helpers/visitedBefore';
import '../shared/u-play/UPlay';

store.addReducers({pieceOfState});

export class UPage extends connect(store)(LitElement) {
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

    render() {
        return html`
          <div class="u-page">
              ${!visitedBefore() ? html`<u-play src="/edu_ya_na_rodinu.mp3" class="first-time-play"></u-play>` : ''}
              ${!visitedBefore() ? html`<u-global-spinner context="first-time" @close="${this.skipIntro}"></u-global-spinner>` : ''}
          
              ${this._dotPage.isVisible ? html`
                  <u-dot .dotId="${this._dotPage.currentDotId}"
                         @hide-dot="${(e) => this._toggleDot(false, e)}"></u-dot>` : ``}              
              
              ${this._objectPage.isVisible ? html`
                  <u-object .objectId="${this._objectPage.currentObjectId}"
                            @hide-object="${(e) => this._toggleObject(false, e)}"></u-object>` : ``}             
              
              ${this._pathPage.isVisible ? html`
                  <u-path .pathId="${this._pathPage.currentPathId}"
                            @hide-path="${(e) => this._togglePath(false, e)}"></u-path>` : ``}
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._dotPage = state.map.dotPage;
        this._objectPage = state.map.objectPage;
        this._pathPage = state.map.pathPage;
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
        // store.dispatch(fetch());
    }

    _setReferences() {
        this.$container = this.shadowRoot.querySelector('.u-page');
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
    _toggleDot(isVisible, e) {
        if (isVisible) {
            store.dispatch(setCurrentDotId(''));
            requestAnimationFrame(() => store.dispatch(setCurrentDotId(e.target.options.id)));

            store.dispatch(toggleDotCreator(false, { x: this._dotCreator.position.x, y: this._dotCreator.position.y }));

            if (this._dotCreator.isVisible) {
                this._toggleDotCreator(false);
            }
        } else {
            store.dispatch(setCurrentDotId(''));
        }
    }

    skipIntro() {
        this.shadowRoot.querySelector('u-play').remove();
        this.setAttribute('default', true);
        localStorage.setItem('visited_before', 'true');
    }
}

window.customElements.define('u-page', UPage);