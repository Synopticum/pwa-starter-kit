//
// Action
//
import { ENV } from '../../../constants';

const GET_OBJECT_TOOLTIP_REQUEST = 'GET_OBJECT_TOOLTIP_REQUEST';
const GET_OBJECT_TOOLTIP_SUCCESS = 'GET_OBJECT_TOOLTIP_SUCCESS';
const GET_OBJECT_TOOLTIP_FAILURE = 'GET_OBJECT_TOOLTIP_FAILURE';

const HIDE_OBJECT_TOOLTIP = 'HIDE_OBJECT_TOOLTIP';

const TOGGLE_CONTEXT_MENU = 'TOGGLE_CONTEXT_MENU';
const TOGGLE_DOT_CREATE = 'TOGGLE_DOT_CREATE';

export const showObjectTooltip = (objectId, tooltipPosition = {}) => async (dispatch, getState) => {
  dispatch({ type: GET_OBJECT_TOOLTIP_REQUEST });

  try {
    const activeObject = await _getObjectById(objectId);

    dispatch({
      type: GET_OBJECT_TOOLTIP_SUCCESS,
      payload: {
        activeObject,
        tooltipPosition
      }
    });
  } catch (e) {
    dispatch({ type: GET_OBJECT_TOOLTIP_FAILURE });
  }
};

export const hideObjectTooltip = (dispatch, getState) => {
  return {
    type: HIDE_OBJECT_TOOLTIP
  }
};

async function _getObjectById(objectId) {
  let response = await fetch(`${ENV.api}/api/objects/${objectId}`, {
    headers: {
      'Token': localStorage.token
    }
  });

  return await response.json();
}

export const toggleContextMenu = (isContextMenuVisible, contextMenuPosition = {}) => {
  return {
    type: TOGGLE_CONTEXT_MENU,
    payload: {
      isContextMenuVisible,
      contextMenuPosition
    }
  }
};

export const toggleDotCreate = (isDotCreateVisible, dotCreateCoordinates = {}) => {
  return {
    type: TOGGLE_DOT_CREATE,
    payload: {
      isDotCreateVisible,
      dotCreateCoordinates
    }
  }
};

//
// Reducer
//
export const map = (state = {
  activeObject: {},

  isTooltipVisible: false,
  tooltipPosition: {},

  isContextMenuVisible: false,
  contextMenuPosition: {},
  contextMenuItems: [],

  isDotCreateVisible: false,
  dotCreateCoordinates: {},
}, action) => {
  switch (action.type) {
    case GET_OBJECT_TOOLTIP_REQUEST:
      return {
        ...state,
        isTooltipFetching: true
      };

    case GET_OBJECT_TOOLTIP_SUCCESS:
      return {
        ...state,
        activeObject: action.payload.activeObject,
        tooltipPosition: action.payload.tooltipPosition,
        isTooltipVisible: true,
        isTooltipFetching: false
      };

    case GET_OBJECT_TOOLTIP_FAILURE:
      return {
        ...state,
        isTooltipFetching: false
      };

    case HIDE_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: false
      };

    case TOGGLE_CONTEXT_MENU:
      return {
        ...state,
        isContextMenuVisible: action.payload.isContextMenuVisible,
        contextMenuPosition: action.payload.contextMenuPosition
      };

    case TOGGLE_DOT_CREATE:
      return {
        ...state,
        isDotCreateVisible: action.payload.isDotCreateVisible,
        dotCreateCoordinates: action.payload.dotCreateCoordinates
      };

    default:
      return state;
  }
};
