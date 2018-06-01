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

export const SharedStyles = html`
<style>
  * {
    box-sizing: border-box;
  }  

  :host {
    display: block;
    box-sizing: border-box;
    font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
  }
  
  [hidden] {
    display: none;
  }
  
  input, textarea {
    font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
    font-size: 18px;
    background-color: #fff;
    border: 1px solid #ccc;
    outline: none;
    resize: none;
  }
  input:focus, textarea:focus {
    border-color: #000;
  }
  input:valid, textarea:valid {
    border-color: #00bb00;
  }
  input:invalid, textarea:invalid {
    border-color: #bb0000;
  }
</style>
`;
