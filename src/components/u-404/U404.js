/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element/lit-element';
import { PageViewElement } from './PageViewElement/page-view-element.js';

class U404 extends PageViewElement {
  render() {
    return html`      
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
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      
      <section>
        <h2>Потрачено!</h2>
      </section>
    `
  }
}

window.customElements.define('u-404', U404);
