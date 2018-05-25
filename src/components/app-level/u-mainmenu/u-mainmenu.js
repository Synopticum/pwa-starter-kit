/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';

import { store } from '../../../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

class UMainMenu extends connect(store)(LitElement) {

  static get properties() {
    return {
      _page: String
    };
  }

  _shouldRender(_props, _changedProps, _prevProps) {
    return _props._page !== undefined && _props._page !== 'login' && _props._page !== 'view404';
  }

  _render({ _page }) {
    return html`
      ${SharedStyles}
      
      <style>          
        :host {
          pointer-events: all;
        }
              
        :host::before {
          content: '';
          position: fixed;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          background: url('../../../../static/images/clouds65.jpg') no-repeat 50% 50%;
          transition: opacity ease .6s;
          will-change: opacity;
          opacity: .2;
          pointer-events: none;
        }
        
        :host(:hover)::before {
          opacity: .6;
        }
        
        .menu {
          position: fixed;
          left: 50%;
          bottom: 25px;
          z-index: 150;
          transform: translate(-50%,0);
          display: flex;
          justify-content: center;
          padding: 5px 0;
          border-radius: 5px;
        }
        
        .menu::before {
          pointer-events: none;
          content: '';
          position: absolute;
          left: -60px;
          top: -115px;
          width: 800px;
          height: 334px;
          background: url('../../../../static/images/mainmenu/cloud.png') no-repeat;
          opacity: 1;
          transition: opacity .6s;
        }
        
        .menu:hover::before {
          opacity: 0;
        }
        
        .menu__item {
          position: relative;
          z-index: 20;
          display: block;
          width: 70px;
          height: 70px;
          margin: 0 3px;
          border-radius: 7px;
          border: 3px solid transparent;
        }
        
        .menu__item[selected] {
          border-color: white;
        }
        
        .menu__item--ads {
          transform: skew(-.112rad);
          background: url('../../../../static/images/mainmenu/ads.svg') no-repeat -22px -25px #fbe9bc;
          background-size: 200%;
          background-clip: content-box;
        }
        
        .menu__item--ideas {
          transform: skew(-.112rad);
          background: url('../../../../static/images/mainmenu/ideas.svg') no-repeat -22px -20px #b2b2b2;
          background-size: 200%;
          background-clip: content-box;
        }
        
        .menu__item--claims {
          transform: skew(-.112rad);
          background: url('../../../../static/images/mainmenu/claims.svg') no-repeat -22px -20px #274264;
          background-size: 200%;
          background-clip: content-box;
        }
        
        .menu__item--news {
          position: relative;
          top: -100px;
          width: 190px;
          text-align: center;
          font-size: 0;
        }
        .menu__item--news[selected] {
          border-color: transparent;
        }
        
        .menu__item--sale {
          transform: skew(.112rad);
          background: url('../../../../static/images/mainmenu/sale.svg') no-repeat -25px -23px;
          background-size: 200%;
          background-clip: content-box;
        }
        
        .menu__item--rides {
          transform: skew(.112rad);
          background: url('../../../../static/images/mainmenu/rides.svg') no-repeat -16px -21px #101010;
          background-size: 200%;
          background-clip: content-box;
        }
        
        .menu__item--anonymous {
          transform: skew(.112rad);
          background: url('../../../../static/images/mainmenu/anonymous.svg') no-repeat -22px -25px #dfe0df;
          background-size: 200%;
          background-clip: content-box;
        }
      </style>
      
      <nav class="menu">
        <a selected?="${_page === 'C★H★E★K★A★V★O'}" href="C★H★E★K★A★V★O" class="menu__item menu__item--ads"></a>
        <a selected?="${_page === 'O★T★O★K★U★J'}" href="O★T★O★K★U★J" class="menu__item menu__item--ideas"></a>
        <a selected?="${_page === 'C★H★O★M★U'}" href="C★H★O★M★U" class="menu__item menu__item--claims"></a>
        <a selected?="${_page === 'U★R★U★S★S★I★N★K★A'}" href="U★R★U★S★S★I★N★K★A" class="menu__item menu__item--news">
          <img src="static/images/mainmenu/news.svg" width="100" height="140"><br>
          <img src="static/images/mainmenu/title.svg" width="180" height="44">
        </a>
        <a selected?="${_page === 'C★H★O★P★O★C★H★O★M'}" href="C★H★O★P★O★C★H★O★M" class="menu__item menu__item--sale"></a>
        <a selected?="${_page === 'P★O★E★D★U'}" href="P★O★E★D★U" class="menu__item menu__item--rides"></a>
        <a selected?="${_page === 'U★D★O★L★I'}" href="U★D★O★L★I" class="menu__item menu__item--anonymous"></a>
      </nav>
    `;
  }

  _stateChanged(state) {
    this._page = state.app.page;
  }
}

window.customElements.define('u-mainmenu', UMainMenu);
