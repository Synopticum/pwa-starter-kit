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
import { PageViewElement } from '../../reusable/page-view-element'

class UUdoli extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
        }
        
        .clouds {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: url('../../../../static/images/clouds65.jpg') no-repeat 50% 50%;
            opacity: .6;
            z-index: 5;
        }
        
        main {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            z-index: 10;
        }
      </style>
      
      <div class="clouds"></div>
      
      <main>      
        <section>
          <h2>Udoli</h2>
        </section>
      </main>
    `
  }
}

window.customElements.define('u-udoli', UUdoli);
