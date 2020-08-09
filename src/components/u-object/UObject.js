import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import props from './UObject.props';
import styles from './UObject.styles';
import {clearEntityState, fetchEntity, setActiveEntityImage } from '../u-entity/UEntity.actions';
import {setCloudsVisibility} from '../u-map/UMap.actions';
import {objectPage} from "./UObject.reducer";
import {isAdmin} from "../u-app/UApp.helpers";
import '../shared/u-textbox/UTextbox';
import '../u-comments/UComments';
import '../shared/u-icon-button/UIconButton';
import '../shared/u-timeline/UTimeline';
import './u-object-controls/UObjectControls';
import {fetchComments} from "../u-comments/UComments.actions";

store.addReducers({objectPage});

class UObject extends connect(store)(LitElement) {
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
        let uObjectClasses = {
            'u-object': true,
            'u-object--loading': this._isFetching
        };

        let photoOverlayClasses = {
            'image-overlay': true,
            'image-overlay--active': this.areCommentsVisible || this.areControlsVisible
        };

        return html`          
          <div class="${classMap(uObjectClasses)}">
            <nav class="nav">
                ${this.areCommentsVisible || this.areControlsVisible ? html`<u-icon-button @click="${this.hideSidebar}" icon="close" class="hide-sidebar"></u-icon-button>` : ''}
                ${isAdmin(this._user) ? html`<u-icon-button @click="${this.toggleControls}" icon="gear"></u-icon-button>` : ''}
                ${!this._isLoadingError ? html`<u-icon-button @click="${this.toggleComments}" icon="comments"></u-icon-button>` : ''}
                <u-icon-button @click="${this.close}" icon="close"></u-icon-button>
            </nav>
            
            ${!this._isLoadingError ? html`
                <main class="wrapper">
                    ${this.hasImage() ? html`
                        <div class="${classMap(photoOverlayClasses)}"></div>
                        <img src="https://urussu.s3.amazonaws.com/${this._activeImage}" 
                             class="image" 
                             alt="Уруссу, ${this._activeYear}"
                             @load="${this.hideSpinner}">
                            
                        <u-timeline .type="${`object`}" .images="${this._object.groupedImages}" .activeYear="${this._activeYear}"></u-timeline>`
                            : (() => { this.hideSpinner(); return 'Изображения отсутствуют' })()
                        }
                    
                    ${this.areControlsVisible ? html`
                        <u-object-controls 
                            .objectId="${this.objectId}" 
                            .activeYear="${this._activeYear}"></u-object-controls>` : ''}
    
                    ${this.areCommentsVisible ? html`<u-comments origin-type="object" origin-id="${this.objectId}"></u-comments>` : ''}
                </main>
            ` : 'Object not found'}
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._user = state.app.user;
        this._object = state.objectPage.object;

        this._activeImage = state.objectPage.activeImage;
        this._activeYear = state.objectPage.activeYear;

        this._isLoadingError = state.objectPage.isLoadingError;
        this._isFetching = state.objectPage.isFetching;
    }

    firstUpdated() {
        this._init();
    }

    disconnectedCallback() {
        document.querySelector('body').removeEventListener('keyup', this.handleEscapePress);
    }

    _init() {
        this._setStore();
        this._setReferences();
        this._setListeners();
    }

    _setStore() {
        store.dispatch(setCloudsVisibility('full'));
        store.dispatch(fetchEntity('object', this.objectId));
        store.dispatch(fetchComments('object', this.objectId));
    }

    _setReferences() {

    }

    _setListeners() {
        document
            .querySelector('body')
            .addEventListener('keyup', (e) => this.handleEscapePress(e) );

        this.addEventListener('u-timeline:change-image', this.changeImage);
        this.addEventListener('u-comments:hide-sidebar', this.hideSidebar);
    }

    _setDefaults() {
        this.areCommentsVisible = false;
        this.areControlsVisible = false;
        this.isSpinnerVisible = true;
    }

    /*
        List of custom component's methods
        Any other methods
    */
    close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearEntityState('object'));
        this.dispatchEvent(new CustomEvent('hide-object', {composed: true}));
    }

    handleEscapePress(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    isObjectAuthor(user) {
        return user.id === this._object.authorId;
    }

    changeImage(e) {
        if (e.detail.type === 'object') {
            const name = e.detail.name;
            store.dispatch(setActiveEntityImage('object', name, this._object.images[name]));

            this.isSpinnerVisible = true;
        }
    }

    toggleComments() {
        this.areCommentsVisible = !this.areCommentsVisible;
    }

    toggleControls() {
        this.areControlsVisible = !this.areControlsVisible;
    }

    hideSidebar() {
        this.areCommentsVisible = false;
        this.areControlsVisible = false;
    }

    hasImage() {
        return Boolean(this._activeImage);
    }

    hideSpinner() {
        this.isSpinnerVisible = false;
    }
}

window.customElements.define('u-object', UObject);
