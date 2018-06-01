/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { ENV } from '../../../constants';
import { html, LitElement } from '@polymer/lit-element';

class USuccess extends LitElement {
  _render(props) {
    return html`
      <style>
        :host {
          position: fixed;
          width: 100vw;
          height: 100vh;
          z-index: 999;
          background-color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
        }
      </style>
      
      <div>Успех</div>
    `
  }

  _firstRendered() {
    // redirect if needed
    if (window.opener && (window.opener.location.pathname.includes('login') || window.opener.location.pathname === '/')) {
      window.opener.location.href = `${ENV.static}/★`;
      window.close();
    }
  }
}

window.customElements.define('u-success', USuccess);
