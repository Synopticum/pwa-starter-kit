import { ENV } from '../../constants';

export const HIDE_OBJECT_INFO = 'HIDE_OBJECT_INFO';

export const UPDATE_OBJECT_INFO_REQUEST = 'UPDATE_OBJECT_INFO_REQUEST';
export const UPDATE_OBJECT_INFO_SUCCESS = 'UPDATE_OBJECT_INFO_SUCCESS';
export const UPDATE_OBJECT_INFO_FAILURE = 'UPDATE_OBJECT_INFO_FAILURE';

export const GET_OBJECT_INFO_REQUEST = 'GET_OBJECT_INFO_REQUEST';
export const GET_OBJECT_INFO_SUCCESS = 'GET_OBJECT_INFO_SUCCESS';
export const GET_OBJECT_INFO_FAILURE = 'GET_OBJECT_INFO_FAILURE';

export const getObjectInfoById = (objectId) => async (dispatch, getState) => {
  dispatch({ type: GET_OBJECT_INFO_REQUEST });

  try {
    const activeObject = await _getObjectById(objectId);

    dispatch({
      type: GET_OBJECT_INFO_SUCCESS,
      payload: activeObject
    });
  } catch (e) {
    dispatch({ type: GET_OBJECT_INFO_FAILURE });
  }
};

export const hideObjectInfo = (dispatch, getState) => {
  history.pushState(null, null, ENV.static);
  return {
    type: HIDE_OBJECT_INFO
  }
};

export const updateObject = (object, objectId) => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_OBJECT_INFO_REQUEST
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
      return dispatch({ type: UPDATE_OBJECT_INFO_FAILURE });
    }

    dispatch({ type: UPDATE_OBJECT_INFO_SUCCESS });
  } catch(e) {
    console.error(e);
    dispatch({ type: UPDATE_OBJECT_INFO_FAILURE });
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