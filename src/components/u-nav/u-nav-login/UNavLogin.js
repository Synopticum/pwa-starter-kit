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
            html`<a title="Войти с помощью VK" 
                    href="https://oauth.vk.com/authorize?client_id=4447151&display=page&redirect_uri=${ENV[window.ENV].static}&response_type=code&v=5.95" 
                    class="login">
                    <svg data-name="Layer 21" height="24" id="Layer_21" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <title/>
                        <path fill="white" d="M21.54736,7H18.25688a.74281.74281,0,0,0-.65452.39156s-1.31237,2.41693-1.73392,3.231C14.73438,12.8125,14,12.125,14,11.10863V7.60417A1.10417,1.10417,0,0,0,12.89583,6.5h-2.474a1.9818,1.9818,0,0,0-1.751.8125s1.25626-.20312,1.25626,1.48958c0,.41974.02162,1.62723.04132,2.64a.72943.72943,0,0,1-1.273.50431,21.54029,21.54029,0,0,1-2.4982-4.54359A.69314.69314,0,0,0,5.5668,7C4.8532,7,3.42522,7,2.57719,7a.508.508,0,0,0-.47969.68481C3.00529,10.17487,6.91576,18,11.37917,18h1.87865A.74219.74219,0,0,0,14,17.25781V16.12342a.7293.7293,0,0,1,1.22868-.5315l2.24861,2.1127A1.08911,1.08911,0,0,0,18.223,18h2.95281c1.42415,0,1.42415-.98824.64768-1.75294-.54645-.53817-2.51832-2.61663-2.51832-2.61663A1.01862,1.01862,0,0,1,19.2268,12.307c.63737-.83876,1.67988-2.21175,2.122-2.79993C21.95313,8.70313,23.04688,7,21.54736,7Z"/>
                    </svg>
                 </a>` :
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