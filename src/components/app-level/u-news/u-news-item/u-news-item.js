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
import { SharedStyles } from '../../../shared-styles.js';

class UNewsItem extends LitElement {

  static get properties() {
    return {
      item: Object
    };
  }

  _render({ item }) {
    return item ? html`
      ${SharedStyles}
      
      <style>
        :host {
            padding: 10px 0;
            border-bottom: 1px solid #ccc;
        }
        
        :host(:first-child) {
            padding-top: 0;
        }
        
        .image img {
            width: 100%;
            max-width: 604px;
            filter: grayscale(100%);
        }
        
        .text {
            line-height: 1.3;
        }
      </style>
      
      <div class="image">${UNewsItem.getPhoto(item)}</div>
      <div class="text">${item.text}</div>
      
      <div class="spacer"></div>
    ` : null;
  }

  static getPhoto(item, size = 604) {
    let url = item.attachments ? item.attachments[0] ? item.attachments[0].photo ? item.attachments[0].photo[`photo_${size}`] ? item.attachments[0].photo[`photo_${size}`] : null : null : null : null;

    return url ? html`<a href$="${item.link}" target="_blank"><img src="${url}"></a>` : '';
  }
}

window.customElements.define('u-news-item', UNewsItem);
