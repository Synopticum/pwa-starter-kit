import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import props from './UPath.props';
import styles from './UPath.styles';
import {clearEntityState, fetchEntity, setActiveEntityImage } from '../u-entity/UEntity.actions';
import {setCloudsVisibility} from '../u-map/UMap.actions';
import {pathPage} from "./UPath.reducer";
import {isAdmin} from "../u-app/UApp.helpers";
import '../shared/u-textbox/UTextbox';
import '../u-comments/UComments';
import '../shared/u-icon-button/UIconButton';
import '../shared/u-timeline/UTimeline';
import './u-path-controls/UPathControls';
import {fetchComments} from "../u-comments/UComments.actions";

store.addReducers({pathPage});

class UPath extends connect(store)(LitElement) {
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
        let UPathClasses = {
            'u-path': true,
            'u-path--loading': this._isFetching
        };

        let photoOverlayClasses = {
            'image-overlay': true,
            'image-overlay--active': this.areCommentsVisible || this.areControlsVisible
        };

        return html`          
          <div class="${classMap(UPathClasses)}">
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
                            
                        <u-timeline .type="${`path`}" .images="${this._path.groupedImages}" .activeYear="${this._activeYear}"></u-timeline>`
            : (() => { this.hideSpinner(); return 'Изображения отсутствуют' })()
        }
                    
                    ${this.areControlsVisible ? html`
                        <u-path-controls 
                            .pathId="${this.pathId}" 
                            .activeYear="${this._activeYear}"></u-path-controls>` : ''}
    
                    ${this.areCommentsVisible ? html`<u-comments origin-type="path" origin-id="${this.pathId}"></u-comments>` : ''}
                </main>
            ` : 'Улица не найдена'}
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._user = state.app.user;
        this._path = state.pathPage.path;

        this._activeImage = state.pathPage.activeImage;
        this._activeYear = state.pathPage.activeYear;

        this._isLoadingError = state.pathPage.isLoadingError;
        this._isFetching = state.pathPage.isFetching;
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
        store.dispatch(fetchEntity('path', this.pathId));
        store.dispatch(fetchComments('path', this.pathId));
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
        store.dispatch(clearEntityState('path'));
        this.dispatchEvent(new CustomEvent('hide-path', {composed: true}));
    }

    handleEscapePress(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    isPathAuthor(user) {
        return user.id === this._path.authorId;
    }

    changeImage(e) {
        if (e.detail.type === 'path') {
            const name = e.detail.name;
            store.dispatch(setActiveEntityImage('path', name, this._path.images[name]));

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

window.customElements.define('u-path', UPath);
