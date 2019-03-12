/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {html} from 'lit-element';

export const SharedStyles = html`
<style>
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    overflow: hidden;
  }

  :host {
    display: block;
    box-sizing: border-box;
    font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
  }
  
  [hidden] {
    display: none;
  }
  
  [contentEditable] {
    outline: none;
  }
  
  .textbox {
    padding: 5px 10px;
    font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
    font-size: 18px;
    background-color: #fff;
    border: 1px solid #000;
    outline: none;
  }
  .textbox:focus {
    border-color: #ddd;
    border-style: dashed;
  }
  .textbox::-webkit-input-placeholder {
    font-style: italic;
  }
  .textbox::-moz-placeholder {
    font-style: italic;
  }
        
  .textarea {
    font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
    border: 1px solid #000;
    background-color: #fff;
    font-size: 14px;
    padding: 10px;
    resize: none;
    outline: none;
  }
  .textarea::-webkit-input-placeholder {
    font-style: italic;
  }
  .textarea::-moz-placeholder {
    font-style: italic;
  }
  
  .button {
    display: flex;
    border: 1px solid #eee;
    background-color: #eee;
    border-radius: 10px;
    padding: 5px 10px;
    outline: none;
    font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
    font-size: 14px;
  }
  .button:active {
    box-shadow: inset 3px 3px 2px rgba(0,0,0,.1);
  }
</style>
`;
