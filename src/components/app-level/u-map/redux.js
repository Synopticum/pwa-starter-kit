//
// Action
//
import { ENV } from '../../../constants';

const OBJECT = {
  TOOLTIP: {
    GET: {
      REQUEST: 'OBJECT_TOOLTIP_GET_REQUEST',
      SUCCESS: 'OBJECT_TOOLTIP_GET_SUCCESS',
      FAILURE: 'OBJECT_TOOLTIP_GET_FAILURE',
    },
    HIDE: 'OBJECT_TOOLTIP_HIDE'
  }
};

const TOGGLE = {
  CONTEXT_MENU: 'TOGGLE_CONTEXT_MENU',
  CREATE_DOT: 'TOGGLE_CREATE_DOT'
};

export const showObjectTooltip = (objectId, tooltipPosition = {}) => async (dispatch, getState) => {
  dispatch({ type: OBJECT.TOOLTIP.GET.REQUEST });

  try {
    const activeObject = await _getObjectById(objectId);

    dispatch({
      type: OBJECT.TOOLTIP.GET.SUCCESS,
      payload: {
        activeObject,
        tooltipPosition
      }
    });
  } catch (e) {
    dispatch({ type: OBJECT.TOOLTIP.GET.FAILURE });
  }
};

export const hideObjectTooltip = (dispatch, getState) => {
  return {
    type: OBJECT.TOOLTIP.HIDE
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
    type: TOGGLE.CONTEXT_MENU,
    payload: {
      isContextMenuVisible,
      contextMenuPosition
    }
  }
};

export const toggleDotCreate = (isDotCreateVisible, dotCreateCoordinates = {}) => {
  return {
    type: TOGGLE.CREATE_DOT,
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
    case OBJECT.TOOLTIP.GET.REQUEST:
      return {
        ...state,
        isTooltipFetching: true
      };

    case OBJECT.TOOLTIP.GET.SUCCESS:
      return {
        ...state,
        activeObject: action.payload.activeObject,
        tooltipPosition: action.payload.tooltipPosition,
        isTooltipVisible: true,
        isTooltipFetching: false
      };

    case OBJECT.TOOLTIP.GET.FAILURE:
      return {
        ...state,
        isTooltipFetching: false
      };

    case OBJECT.TOOLTIP.HIDE:
      return {
        ...state,
        isTooltipVisible: false
      };

    case TOGGLE.CONTEXT_MENU:
      return {
        ...state,
        isContextMenuVisible: action.payload.isContextMenuVisible,
        contextMenuPosition: action.payload.contextMenuPosition
      };

    case TOGGLE.CREATE_DOT:
      return {
        ...state,
        isDotCreateVisible: action.payload.isDotCreateVisible,
        dotCreateCoordinates: action.payload.dotCreateCoordinates
      };

    default:
      return state;
  }
};
