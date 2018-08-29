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
      _page: { type: String }
    };
  }

  shouldUpdate() {
    return this._page !== undefined && this._page !== 'login' && this._page !== '404';
  }

  render() {
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
        
        :host([page-active])::before {
          opacity: .6;
          pointer-events: all;
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
          perspective: 800px;
        }
        
        .menu::before {
          pointer-events: none;
          content: '';
          position: absolute;
          left: -90px;
          top: -115px;
          width: 800px;
          height: 334px;
          background: url('../../../../static/images/mainmenu/cloud.png') no-repeat;
          opacity: 1;
          transition: opacity .6s;
        }
        
        .menu__item {
          position: relative;
          z-index: 20;
          display: block;
          width: 70px;
          height: 70px;
          margin: 0 3px;
          border-radius: 7px;
        }
        
        .menu__item:not(.menu__item--news)[selected] {
          border-color: rgba(255,255,0,1);
          opacity: 1;
        }
        
        .menu__item:not(.menu__item--news) {
          border: 3px solid rgba(255,255,255,1);
          transition: opacity .1s, border-color .1s, box-shadow .1s;
          box-shadow: 0 2px 1px rgba(0, 0, 0, 0.2), inset 0 2px 1px rgba(0, 0, 0, 0.2);
        }
        
        .menu__item:not(.menu__item--news):hover {
          border-color: rgba(255,255,0,1);
          opacity: 1;
        }
        
        .menu__item--ads {
          width: 62px;
          height: 62px;
          top: 4px;
          margin-right: 0;
          transform: skew(-.112rad) rotate3d(0, 1, 0, -20deg);
          background: url('../../../../static/images/mainmenu/ads.svg') no-repeat -22px -20px #fbe9bc;
          background-size: 200%;
          background-clip: content-box;
          opacity: .8;
        }
        
        .menu__item--ideas {
          width: 66px;
          height: 66px;
          top: 2px;
          margin-left: 0;
          transform: skew(-.112rad) rotate3d(0, 1, 0, -15deg);
          background: url('../../../../static/images/mainmenu/ideas.svg') no-repeat -22px -20px #b2b2b2;
          background-size: 200%;
          background-clip: content-box;
          opacity: .9;
        }
        
        .menu__item--claims {
          transform: skew(-.112rad) rotate3d(0, 1, 0, -5deg);
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
          transform: skew(.112rad) rotate3d(0, 1, 0, 5deg);
          background: url('../../../../static/images/mainmenu/sale.svg') no-repeat -25px -23px;
          background-size: 200%;
          background-clip: content-box;
        }
        
        .menu__item--rides {
          width: 66px;
          height: 66px;
          top: 2px;
          margin-right: 0;
          transform: skew(.112rad) rotate3d(0, 1, 0, 15deg);
          background: url('../../../../static/images/mainmenu/rides.svg') no-repeat -16px -21px #101010;
          background-size: 200%;
          background-clip: content-box;
          opacity: .9;
        }
        
        .menu__item--anonymous {
          width: 62px;
          height: 62px;
          top: 4px;
          margin-left: 0;
          transform: skew(.112rad) rotate3d(0, 1, 0, 20deg);
          background: url('../../../../static/images/mainmenu/anonymous.svg') no-repeat -18px -20px #dfe0df;
          background-size: 200%;
          background-clip: content-box;
          opacity: .8;
        }
      </style>
      
      <nav class="menu">
        <a ?selected="${this._page === 'C★H★E★K★A★V★O'}" href="C★H★E★K★A★V★O" class="menu__item menu__item--ads"></a>
        <a ?selected="${this._page === 'Z★A★P★I★L★I'}" href="Z★A★P★I★L★I" class="menu__item menu__item--ideas"></a>
        <a ?selected="${this._page === 'C★H★O★M★U'}" href="C★H★O★M★U" class="menu__item menu__item--claims"></a>
        <a ?selected="${this._page === 'U★R★U★S★S★I★N★K★A'}" href="U★R★U★S★S★I★N★K★A" class="menu__item menu__item--news">
          <img src="static/images/mainmenu/news.svg" width="100" height="140"><br>
          <img src="static/images/mainmenu/title.svg" width="180" height="44">
        </a>
        <a ?selected="${this._page === 'C★H★O★P★O★C★H★O★M'}" href="C★H★O★P★O★C★H★O★M" class="menu__item menu__item--sale"></a>
        <a ?selected="${this._page === 'P★O★E★D★U'}" href="P★O★E★D★U" class="menu__item menu__item--rides"></a>
        <a ?selected="${this._page === 'U★D★O★L★I'}" href="U★D★O★L★I" class="menu__item menu__item--anonymous"></a>
      </nav>
    `;
  }

  _stateChanged(state) {
    this._page = state.app.page;
  }
}

window.customElements.define('u-mainmenu', UMainMenu);
