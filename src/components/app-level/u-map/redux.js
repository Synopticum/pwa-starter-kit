//
// Action
//
import { ENV } from '../../../constants';

const TOOLTIP = {
  GET: {
    REQUEST: 'TOOLTIP_GET_REQUEST',
    SUCCESS: 'TOOLTIP_GET_SUCCESS',
    FAILURE: 'TOOLTIP_GET_FAILURE',
  }
};

const TOGGLE = {
  TOOLTIP: 'TOGGLE_TOOLTIP',
  CONTEXT_MENU: 'TOGGLE_CONTEXT_MENU',
  CREATE_DOT: 'TOGGLE_CREATE_DOT'
};

export const toggleTooltip = (enable, objectId, tooltipPosition = {}) => async (dispatch, getState) => {
  if (enable) {
    dispatch({ type: TOOLTIP.GET.REQUEST });

    try {
      const object = await _getObjectById(objectId, dispatch);

      dispatch({
        type: TOOLTIP.GET.SUCCESS,
        payload: {
          object,
          tooltipPosition
        }
      });

      dispatch({
        type: TOGGLE.TOOLTIP,
        payload: {
          isTooltipVisible: true
        }
      });
    } catch (e) {
      dispatch({ type: TOOLTIP.GET.FAILURE });
    }
  } else {
    dispatch({
      type: TOGGLE.TOOLTIP,
      payload: {
        isTooltipVisible: false
      }
    })
  }
};

const _getObjectById = async (objectId, dispatch) => {
  let response = await fetch(`${ENV.api}/api/objects/${objectId}`, {
    headers: {
      'Token': localStorage.token
    }
  });

  if (!response.ok) {
    if (response.status === 401) location.reload();
    return dispatch({ type: TOOLTIP.GET.FAILURE });
  }

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
  tooltipObject: {},
  isTooltipVisible: false,
  tooltipPosition: {},

  isContextMenuVisible: false,
  contextMenuPosition: {},
  contextMenuItems: [],

  isDotCreateVisible: false,
  dotCreateCoordinates: {},
}, action) => {
  switch (action.type) {
    case TOOLTIP.GET.REQUEST:
      return {
        ...state,
        isTooltipFetching: true
      };

    case TOOLTIP.GET.SUCCESS:
      return {
        ...state,
        tooltipObject: action.payload.object,
        tooltipPosition: action.payload.tooltipPosition,
        isTooltipVisible: true,
        isTooltipFetching: false
      };

    case TOOLTIP.GET.FAILURE:
      return {
        ...state,
        isTooltipFetching: false
      };

    case TOGGLE.TOOLTIP:
      return {
        ...state,
        isTooltipVisible: action.payload.isTooltipVisible
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
