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
      item: { type: Object }
    };
  }

  render() {
    return this.item ? html`
      ${SharedStyles}
      
      <style>
        :host {
            margin: 10px;
            border-bottom: 1px solid #ccc;
        }
        
        .thumbnail {
            display: block;
            width: 100%;
            max-width: 604px;
            height: 200px;
            background-size: cover;
            background-position: 50% 50%;
            filter: grayscale(100%);
        }
        
        .text {
            margin: 5px 0 10px 0;
            font-size: var(--text-size, 18px);
            line-height: 1.3em;
            border-radius: 10px;
            text-align: justify;
            hyphens: auto;
            white-space: pre-wrap;
        }
        
        .text::first-letter {
            font-weight: bold;
        }
      </style>
      
      <div class="text" lang="ru">${this.item.text}</div>
      
      <div class="spacer"></div>
    ` : null;
  }

  static getPhoto(item, size = 604) {
    let url = item.attachments ? item.attachments[0] ? item.attachments[0].photo ? item.attachments[0].photo[`photo_${size}`] ? item.attachments[0].photo[`photo_${size}`] : null : null : null : null;

    return url ? url : '';
  }
}

window.customElements.define('u-news-item', UNewsItem);
