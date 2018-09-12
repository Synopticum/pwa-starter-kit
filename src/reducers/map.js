/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
  SHOW_OBJECT_TOOLTIP,
  HIDE_OBJECT_TOOLTIP,
  HIDE_OBJECT_INFO,
  GET_OBJECT_INFO_REQUEST,
  GET_OBJECT_INFO_SUCCESS,
  GET_OBJECT_INFO_FAILURE,
  UPDATE_OBJECT_INFO_REQUEST,
  UPDATE_OBJECT_INFO_SUCCESS,
  UPDATE_OBJECT_INFO_FAILURE } from '../actions/map.js';

const map = (state = {
  activeObject: {},
  tooltipPosition: {},
  isTooltipVisible: false,
  isInfoVisible: false,
  getObjectInfoState: 'untouched',
  saveState: 'untouched',
  isObjectInfoFetching: false,
  isObjectInfoUpdating: false
}, action) => {
  switch (action.type) {
    case SHOW_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: true,
        activeObject: action.payload.activeObject,
        tooltipPosition: action.payload.tooltipPosition
      };

    case HIDE_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: false
      };

    case GET_OBJECT_INFO_REQUEST:
      return {
        ...state,
        isObjectInfoFetching: true
      };

    case GET_OBJECT_INFO_SUCCESS:
      return {
        ...state,
        activeObject: action.payload,
        getObjectInfoState: 'SUCCESS',
        isObjectInfoVisible: true,
        isObjectInfoFetching: false
      };

    case GET_OBJECT_INFO_FAILURE:
      return {
        ...state,
        getObjectInfoState: 'FAILURE',
        isObjectInfoFetching: false
      };

    case HIDE_OBJECT_INFO:
      return {
        ...state,
        isObjectInfoVisible: false
      };

    case UPDATE_OBJECT_INFO_REQUEST:
      return {
        ...state,
        isObjectInfoUpdating: true
      };

    case UPDATE_OBJECT_INFO_SUCCESS:
      return {
        ...state,
        saveState: 'SUCCESS',
        isObjectInfoUpdating: false
      };

    case UPDATE_OBJECT_INFO_FAILURE:
      return {
        ...state,
        saveState: 'FAILURE',
        isObjectInfoUpdating: false
      };

    default:
      return state;
  }
};

export default map;
