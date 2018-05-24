/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { PageViewElement } from '../../reusable/page-view-element';

class UUdoli extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
          position: fixed;
          left: 50%;
          bottom: 130px;
          transform: translate(-50%,0);
          z-index: 100;
          width: 700px;
          height: 400px;
          background-color: #ffffff;
          border-radius: 5px;
          pointer-events: all;
        }
      </style>
      
      <div class="asd">
        Udoli
      </div>
    `;
  }
}

window.customElements.define('u-udoli', UUdoli);
