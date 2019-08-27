import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import props from './UDot.props';
import styles from './UDot.styles';
import {clearDotState, fetchDot, setActiveImage} from './UDot.actions';
import {setCloudsVisibility} from '../u-map/UMap.actions';
import {dotPage} from "./UDot.reducer";
import {isAdmin} from "../u-app/UApp.helpers";
import '../u-textbox/UTextbox';
import '../u-comments/UComments';
import '../u-dot-controls/UDotControls';
import '../u-dot-timeline/UDotTimeline';
import {fetchComments} from "../u-comments/UComments.actions";

store.addReducers({dotPage});

class UDot extends connect(store)(LitElement) {
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
          <div class="u-dot">
            <nav class="nav">
                ${!this._isLoadingError ? html`<button @click="${this.toggleComments}" class="icon-button icon-button--comments ${this.areCommentsVisible ? 'icon-button--comments-are-visible' : ''}"></button>` : ''}
                <button @click="${this.close}" class="icon-button icon-button--close"></button>
            </nav>
            
            ${!this._isLoadingError ? html`
                <main class="wrapper">
                    ${this.hasImage() ? html`
                        <div class="image-overlay ${this.areCommentsVisible ? 'image-overlay--active' : ''}"></div>
                        <img src="https://urussu.s3.amazonaws.com/${this._activeImage}" 
                             class="image" 
                             alt="Уруссу, ${this._activeDecade} годы">
                            
                        <u-dot-timeline .images="${this._dot.images}" .activeDecade="${this._activeDecade}"></u-dot-timeline>` 
                        : 'Изображения отсутствуют'
                    }
    
                    ${isAdmin(this._user) ? html`<u-dot-controls .dotId="${this.dotId}"></u-dot-controls>` : ''}
    
                    ${this.areCommentsVisible ? html`<u-comments origin-type="dot" origin-id="${this.dotId}"></u-comments>` : ''}
                </main>
            ` : 'Dot not found'}
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._user = state.app.user;
        this._dot = state.dotPage.dot;

        this._activeImage = state.dotPage.activeImage;
        this._activeDecade = state.dotPage.activeDecade;

        this._isLoadingError = state.dotPage.isLoadingError;
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
        store.dispatch(fetchDot(this.dotId));
        store.dispatch(fetchComments('dot', this.dotId));
    }

    _setReferences() {

    }

    _setListeners() {
        document
            .querySelector('body')
            .addEventListener('keyup', (e) => this.handleEscapePress(e) );

        this.addEventListener('u-dot-timeline:change-image', this.changeImage);
    }

    _setDefaults() {
        this.areCommentsVisible = false;
    }

    /*
        List of custom component's methods
        Any other methods
    */
    close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearDotState());
        this.dispatchEvent(new CustomEvent('hide-dot', {composed: true}));
    }

    handleEscapePress(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    isDotAuthor(user) {
        return user.id === this._dot.authorId;
    }

    changeImage(e) {
        const decade = e.detail.decade;
        store.dispatch(setActiveImage(decade, this._dot.images[decade]));
    }

    toggleComments() {
        this.areCommentsVisible = !this.areCommentsVisible;
    }

    hasImage() {
        return Boolean(this._activeImage);
    }
}

window.customElements.define('u-dot', UDot);
