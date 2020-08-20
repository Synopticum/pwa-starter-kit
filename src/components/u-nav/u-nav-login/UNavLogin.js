import {html, LitElement} from 'lit-element/lit-element';
import props from './UNavLogin.props';
import styles from './UNavLogin.styles';
import {ENV} from "../../../../environments/environments";
import {classMap} from "lit-html/directives/class-map";

export class UNavLogin extends LitElement {
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
        let userImageClasses = {
            'user__image': true,
            'user__image--none': !this.imageUrl
        };

        return html`    
          <style>
            .user__image {
                background: url(${this.imageUrl}) no-repeat 50% 50% #ddd;
            }
          </style>
      
          <div class="u-nav-login">
            ${this.isAnonymous ?
            html`<a href="https://oauth.vk.com/authorize?client_id=4447151&display=page&redirect_uri=${ENV[window.ENV].static}&response_type=code&v=5.95" 
                    class="login"><div class="title">Войти на сайт</div></a>` :
            html`<div class="user" @click="${this._logout}">
                    <div class="${classMap(userImageClasses)}"></div>
                 </div>`}
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
        this.$container = this.shadowRoot.querySelector('.u-nav-login');
    }

    _setListeners() {
        this.addEventListener('something-happened', this.somethingHappened);
    }

    /*
        List of custom component's methods
        Any other methods
    */
    somethingHappened() {
        // Use code below to trigger this method from the outside:
        //
        // this.dispatchEvent(new CustomEvent('something-happened', { detail: 'some payload', composed: true }));
        //
    }

    _logout() {
        localStorage.token = '';
        location.reload();
    }
}

window.customElements.define('u-nav-login', UNavLogin);