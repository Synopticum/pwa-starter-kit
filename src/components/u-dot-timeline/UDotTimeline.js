import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import props from './UDotTimeline.props';
import styles from './UDotTimeline.styles';

export class UDotTimeline extends LitElement {

    constructor() {
        super();
        this._setDefaults();
    }

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
        let decadesClasses = {
            'decades': true,
            'decades--only-child': Object.entries(this.images).length === 1
        };

        return html`
          <div class="u-dot-timeline">
            
            <nav class="${classMap(decadesClasses)}">
              <div class="underline"></div>
              <div class="underline"></div>
              <div class="underline"></div>
              ${this.images && this.activeDecade ? Object.entries(this.images).map((decade, index) => this.renderDecade(decade, index)) : ''}
            </nav>
          </div> 
    `;
    }

    firstUpdated() {
        this._init();
    }

    _init() {
        this._setReferences();
        this._setListeners();
    }
    _setReferences() {

    }

    _setListeners() {
        this.addEventListener('something-happened', this.somethingHappened);
    }

    _setDefaults() {
    }

    /*
        List of render methods
     */
    renderDecade(decade, index) {
        let decadeClasses = {
            'decade': true,
            'decade--active': decade[0] === this.activeDecade
        };

        return html`<a class="${classMap(decadeClasses)}" @click="${() => this.changeImage(decade[0], index)}">${decade[0]}</a>`;
    }

    /*
        List of custom component's methods
    */
    changeImage(decade, index) {
        this.ul(index);
        this.dispatchEvent(new CustomEvent('u-dot-timeline:change-image', { detail: { decade }, composed: true }));
    }

    ul(index) {
        const underlines = this.shadowRoot.querySelectorAll(".underline");

        for (let i = 0; i < underlines.length; i++) {
            underlines[i].style.transform = 'translate3d(' + index * 100 + '%,0,0)';
        }
    }
}

window.customElements.define('u-dot-timeline', UDotTimeline);