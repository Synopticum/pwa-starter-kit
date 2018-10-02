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
  DOT_CREATOR: 'TOGGLE_DOT_CREATOR'
};

const DOT_CREATOR = {
  UPDATE_FORM: 'DOT_CREATOR_UPDATE_FORM'
};

const OBJECT_PAGE = {
  SET_ID: 'OBJECT_PAGE_SET_ID'
};

export const toggleTooltip = (enable, objectId, position = {}) => async (dispatch, getState) => {
  if (enable) {
    dispatch({ type: TOOLTIP.GET.REQUEST });

    try {
      const object = await _getObject(objectId, dispatch);

      dispatch({
        type: TOOLTIP.GET.SUCCESS,
        payload: {
          object,
          position
        }
      });

      dispatch({
        type: TOGGLE.TOOLTIP,
        payload: true
      });
    } catch (e) {
      dispatch({ type: TOOLTIP.GET.FAILURE });
    }
  } else {
    dispatch({
      type: TOGGLE.TOOLTIP,
      payload: false
    })
  }
};

const _getObject = async (objectId, dispatch) => {
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

export const toggleContextMenu = (isVisible, position = {}) => {
  return {
    type: TOGGLE.CONTEXT_MENU,
    payload: {
      isVisible,
      position
    }
  }
};

export const toggleDotCreator = (isVisible, position = {}) => {
  return {
    type: TOGGLE.DOT_CREATOR,
    payload: {
      isVisible,
      position
    }
  }
};

export const updateForm = (state) => (dispatch, getState) => {
  dispatch({
    type: DOT_CREATOR.UPDATE_FORM,
    payload: state
  });
};

export const setCurrentObjectId = (objectId) => (dispatch, getState) => {
  if (!objectId) history.pushState(null, null, ENV.static);

  dispatch({
    type: OBJECT_PAGE.SET_ID,
    payload: objectId
  });
};

//
// Reducer
//
export const map = (state = {
  tooltip: {
    isVisible: false,
    isFetching: false,
    object: {},
    position: {},
  },

  contextMenu: {
    isVisible: false,
    position: {}
  },

  dotCreator: {
    isVisible: false,
    position: {},
    title: '',
    layer: 'default',
    type: 'global'
  }
}, action) => {
  switch (action.type) {
    case TOOLTIP.GET.REQUEST:
      return {
        ...state,
        tooltip: {
          ...state.tooltip,
          isFetching: true

        }
      };

    case TOOLTIP.GET.SUCCESS:
      return Object.assign({}, state, {
        tooltip: {
          ...state.tooltip,
          isFetching: false,
          object: action.payload.object,
          position: action.payload.position
        }
      });

    case TOOLTIP.GET.FAILURE:
      return Object.assign({}, state, {
        tooltip: {
          ...state.tooltip,
          isFetching: false
        }
      });

    case TOGGLE.TOOLTIP:
      return Object.assign({}, state, {
        tooltip: {
          ...state.tooltip,
          isVisible: action.payload
        }
      });

    case TOGGLE.CONTEXT_MENU:
      return Object.assign({}, state, {
        contextMenu: {
          ...state.contextMenu,
          isVisible: action.payload.isVisible,
          position: action.payload.position
        }
      });

    case TOGGLE.DOT_CREATOR:
      return Object.assign({}, state, {
        dotCreator: {
          ...state.dotCreator,
          isVisible: action.payload.isVisible,
          position: action.payload.position
        }
      });

    case DOT_CREATOR.UPDATE_FORM:
      return Object.assign({}, state, {
        dotCreator: {
          ...state.dotCreator,
          ...action.payload
        }
      });

    case OBJECT_PAGE.SET_ID:
      return Object.assign({}, state, {
        currentObjectId: action.payload
      });

    default:
      return state;
  }
};

