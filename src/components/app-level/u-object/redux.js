//
// Action
//
import { ENV } from '../../../constants';

export const OBJECT = {
  GET: {
    REQUEST: 'OBJECT_GET_REQUEST',
    SUCCESS: 'OBJECT_GET_SUCCESS',
    FAILURE: 'OBJECT_GET_FAILURE'
  },
  PUT: {
    REQUEST: 'OBJECT_PUT_REQUEST',
    SUCCESS: 'OBJECT_PUT_SUCCESS',
    FAILURE: 'OBJECT_PUT_FAILURE'
  },
  HIDE: 'OBJECT_HIDE'
};

export const getObjectInfoById = (objectId) => async (dispatch, getState) => {
  dispatch({ type: OBJECT.GET.REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/objects/${objectId}`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: OBJECT.GET.FAILURE });
    }

    let activeObject = await response.json();
    history.pushState(null, null, `${ENV.static}/objects/${objectId}`);

    dispatch({
      type: OBJECT.GET.SUCCESS,
      payload: activeObject
    });
  } catch (e) {
    dispatch({ type: OBJECT.GET.FAILURE });
  }
};

export const putObject = (object, objectId) => async (dispatch, getState) => {
  dispatch({
    type: OBJECT.PUT.REQUEST
  });

  try {
    let response = await fetch(`${ENV.api}/api/objects/${objectId}`, {
      method: 'PUT',
      body: JSON.stringify(object),
      headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      return dispatch({ type: OBJECT.PUT.FAILURE });
    }

    dispatch({ type: OBJECT.PUT.SUCCESS });
  } catch(e) {
    console.error(e);
    dispatch({ type: OBJECT.PUT.FAILURE });
  }
};

export const hideObjectInfo = (dispatch, getState) => {
  history.pushState(null, null, ENV.static);
  return {
    type: OBJECT.HIDE
  }
};

//
// Reducer
//
export const object = (state = {
  activeObject: {},
  isVisible: false,
  isFetching: false,
  isUpdating: false
}, action) => {
  switch (action.type) {
    case OBJECT.GET.REQUEST:
      return {
        ...state,
        isFetching: true
      };

    case OBJECT.GET.SUCCESS:
      return {
        ...state,
        activeObject: action.payload,
        isVisible: true,
        isFetching: false
      };

    case OBJECT.GET.FAILURE:
      return {
        ...state,
        isFetching: false
      };

    case OBJECT.HIDE:
      return {
        ...state,
        isVisible: false
      };

    case OBJECT.PUT.REQUEST:
      return {
        ...state,
        isUpdating: true
      };

    case OBJECT.PUT.SUCCESS:
      return {
        ...state,
        isUpdating: false
      };

    case OBJECT.PUT.FAILURE:
      return {
        ...state,
        isUpdating: false
      };

    default:
      return state;
  }
};