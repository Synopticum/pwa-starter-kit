import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../store';
import {connect} from 'pwa-helpers';
import {search, toggle} from './UNavSearch.actions';
import {searchResults} from "./UNavSearch.reducer";
import props from './UNavSearch.props';
import styles from './UNavSearch.styles';
import '../../shared/u-textbox/UTextbox';
import debounce from '../../../helpers/debounce';
import isEmpty from "../../../helpers/isEmpty";
import {map} from "../../u-map/UMap.reducer";

store.addReducers({map, searchResults});

export class UNavSearch extends connect(store)(LitElement) {
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
          <div class="u-nav-search">
            <div class="controls">
                <u-textbox 
                    type="text" 
                    value="" 
                    @keyup="${debounce(this.search.bind(this), 300)}" 
                    class="controls__textinput"
                    placeholder="Введите слово для поиска..."></u-textbox>
            </div>
            
            ${this._searchResults && !isEmpty(this._searchResults) ? this.renderResults() : ''}
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._searchResults = state.searchResults;
        this._settings = state.map.settings;
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
        this.$input = this.shadowRoot.querySelector('.controls__textinput');
        this._map = document.querySelector('u-map');
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
    search() {
        const value = this.$input.value;
        store.dispatch(search(value));
    }

    renderResults() {
        return html`
            <div class="results">
                ${this._searchResults.map(entry => this.renderEntry(entry))}
            </div>
        `;
    }

    renderEntry(entry) {
        if (entry.instanceType === 'object') return html`
            <div class="results__entry" @click="${() => this.openEntry(entry)}">
                ${this.renderObjectEntry(entry)}
            </div>
        `;

        if (entry.instanceType === 'dot') return html`
            <div class="results__entry" @click="${() => this.openEntry(entry)}">
                ${this.renderDotEntry(entry)}
            </div>
        `;

        if (entry.instanceType === 'path') return html`
            <div class="results__entry" @click="${() => this.openEntry(entry)}">
                ${this.renderPathEntry(entry)}
            </div>
        `;
    }

    renderObjectEntry(entry) {
        if (entry.street && entry.house) {
            return html`
                    <div class="results__entry-tag results__entry-tag--house"></div>
                    <div class="results__entry-title">${entry.street}, ${entry.house}</div>
                `;
        }

        if (entry.title) {
            return html`
                    <div class="results__entry-tag results__entry-tag--house"></div>
                    <div class="results__entry-title">${entry.title}</div>
                `;
        }

        return '';
    }

    renderDotEntry(entry) {
        if (entry.title) {
            return html`
                    <div class="results__entry-tag results__entry-tag--dot"></div>
                    <div class="results__entry-title">${entry.title}</div>
                `;
        }

        return '';
    }

    renderPathEntry(entry) {
        if (entry.title) {
            return html`
                    <div class="results__entry-tag results__entry-tag--street"></div>
                    <div class="results__entry-title">${entry.title}</div>
                `;
        }

        return '';
    }

    openEntry(entry) {
        const type = entry.instanceType;
        const zoom = this._settings.zoom;
        const id = entry.id.split('-')[0];
        let coordinates;

        switch (type) {
            case 'object':
                [coordinates] = entry.coordinates[0];
                break;

            case 'path':
                coordinates = entry.coordinates[0];
                break;

            case 'dot':
                coordinates = entry.coordinates;
                break;
        }

        this._map.dispatchEvent(new CustomEvent(`u-nav-search::set-view-${type}`, {
            detail: { coordinates, zoom, id },
            composed: true,
            bubbles: true
        }));
    }
}

window.customElements.define('u-nav-search', UNavSearch);