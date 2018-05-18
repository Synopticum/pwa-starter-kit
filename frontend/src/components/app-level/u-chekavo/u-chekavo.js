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

import { store } from '../../../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import { activateMap } from '../../../actions/map.js';
import map from '../../../reducers/map.js';
store.addReducers({
  map
});

class UChekavo extends connect(store)(PageViewElement) {

  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Chekavo</h2>
      </section>
    `
  }

  _stateChanged() {

  }
}

window.customElements.define('u-chekavo', UChekavo);
