//
// Action
//
import { ENV } from '../../../constants';

const HIDE_OBJECT_INFO = 'HIDE_OBJECT_INFO';

const UPDATE_OBJECT_REQUEST = 'UPDATE_OBJECT_REQUEST';
const UPDATE_OBJECT_SUCCESS = 'UPDATE_OBJECT_SUCCESS';
const UPDATE_OBJECT_FAILURE = 'UPDATE_OBJECT_FAILURE';

const GET_OBJECT_REQUEST = 'GET_OBJECT_REQUEST';
const GET_OBJECT_SUCCESS = 'GET_OBJECT_SUCCESS';
const GET_OBJECT_FAILURE = 'GET_OBJECT_FAILURE';

export const getObjectInfoById = (objectId) => async (dispatch, getState) => {
  dispatch({ type: GET_OBJECT_REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/objects/${objectId}`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: GET_OBJECT_FAILURE });
    }

    let activeObject = await response.json();
    history.pushState(null, null, `${ENV.static}/objects/${objectId}`);

    dispatch({
      type: GET_OBJECT_SUCCESS,
      payload: activeObject
    });
  } catch (e) {
    dispatch({ type: GET_OBJECT_FAILURE });
  }
};

export const putObject = (object, objectId) => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_OBJECT_REQUEST
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
      return dispatch({ type: UPDATE_OBJECT_FAILURE });
    }

    dispatch({ type: UPDATE_OBJECT_SUCCESS });
  } catch(e) {
    console.error(e);
    dispatch({ type: UPDATE_OBJECT_FAILURE });
  }
};

export const hideObjectInfo = (dispatch, getState) => {
  history.pushState(null, null, ENV.static);
  return {
    type: HIDE_OBJECT_INFO
  }
};

//
// Reducer
//
export const object = (state = {
  activeObject: {},
  fetchState: 'untouched',
  saveState: 'untouched',
  isVisible: false,
  isFetching: false,
  isUpdating: false
}, action) => {
  switch (action.type) {
    case GET_OBJECT_REQUEST:
      return {
        ...state,
        isFetching: true
      };

    case GET_OBJECT_SUCCESS:
      return {
        ...state,
        activeObject: action.payload,
        fetchState: 'SUCCESS',
        isVisible: true,
        isFetching: false
      };

    case GET_OBJECT_FAILURE:
      return {
        ...state,
        fetchState: 'FAILURE',
        isFetching: false
      };

    case HIDE_OBJECT_INFO:
      return {
        ...state,
        isVisible: false
      };

    case UPDATE_OBJECT_REQUEST:
      return {
        ...state,
        isUpdating: true
      };

    case UPDATE_OBJECT_SUCCESS:
      return {
        ...state,
        saveState: 'SUCCESS',
        isUpdating: false
      };

    case UPDATE_OBJECT_FAILURE:
      return {
        ...state,
        saveState: 'FAILURE',
        isUpdating: false
      };

    default:
      return state;
  }
};