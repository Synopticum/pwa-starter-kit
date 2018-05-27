/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { SHOW_OBJECT_TOOLTIP, HIDE_OBJECT_TOOLTIP } from '../actions/map.js';

const map = (state = { objectTooltip: null, position: {} }, action) => {
  switch (action.type) {
    case SHOW_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: Boolean(action.objectTooltip),
        objectTooltip: action.objectTooltip,
        position: action.position
      };

    case HIDE_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: false
      };

    default:
      return state;
  }
};

export default map;
