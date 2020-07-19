import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import props from './UPathTimeline.props';
import styles from './UPathTimeline.styles';

export class UPathTimeline extends LitElement {

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
        let yearsClasses = {
            'years': true,
            'years--only-child': Path.entries(this.images).length === 1
        };

        return html`
          <div class="u-path-timeline">
            
            <nav class="${classMap(yearsClasses)}">
              <div class="underline"></div>
              <div class="underline"></div>
              <div class="underline"></div>
              ${this.images && this.activeYear ? Path.entries(this.images).map((year, index) => this.renderYear(year, index)) : ''}
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
    renderYear(year, index) {
        let yearClasses = {
            'year': true,
            'year--active': year[0] === this.activeYear
        };

        return html`<a class="${classMap(yearClasses)}" @click="${() => this.changeImage(year[0], index)}">${year[0]}</a>`;
    }

    /*
        List of custom component's methods
    */
    changeImage(year, index) {
        this.ul(index);
        this.dispatchEvent(new CustomEvent('u-path-timeline:change-image', { detail: { year }, composed: true }));
    }

    ul(index) {
        const underlines = this.shadowRoot.querySelectorAll(".underline");

        for (let i = 0; i < underlines.length; i++) {
            underlines[i].style.transform = 'translate3d(' + index * 100 + '%,0,0)';
        }
    }
}

window.customElements.define('u-path-timeline', UPathTimeline);