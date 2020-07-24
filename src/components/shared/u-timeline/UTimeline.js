import {html, LitElement} from 'lit-element/lit-element';
import {classMap} from 'lit-html/directives/class-map';
import props from './UTimeline.props';
import styles from './UTimeline.styles';

export class UTimeline extends LitElement {

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
            'years--only-child': this.images.length === 1
        };

        return html`
          <div class="u-timeline">
            <nav class="${classMap(yearsClasses)}">
              ${this.images && this.activeYear ? this.renderTimeline(this.images) : ''}
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
    renderTimeline(images) {
        return Object.entries(images).map(([index, image]) => {
            if (typeof image === 'object') return this.renderNestedYear(image, index);

            const year = index;
            const url = image;
            const name = index;
            return this.renderYear(year, url, name);
        });
    }

    renderYear(year, url, name) {
        const yearClasses = {
            'year': true,
            'year--active': name === this.activeYear
        };

        return html`<a class="${classMap(yearClasses)}" 
                       @click="${() => this.changeImage(name)}">${year}</a>`;
    }

    renderNestedYear(images, index) {
        return html`
            <div class="nested-year">
            ${Object.entries(images).map(([year, url]) => {
                const isNested = parseInt(year) !== parseInt(index);
                const name = isNested ? `${index}_${year}` : index;
    
                return this.renderYear(year, url, name);
            })}
            </div>`
    }

    /*
        List of custom component's methods
    */
    changeImage(name) {
        this.dispatchEvent(new CustomEvent(`u-timeline:change-image`, { detail: { name, type: this.type }, composed: true }));
    }
}

window.customElements.define('u-timeline', UTimeline);