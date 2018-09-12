import { ENV } from '../../constants';

export const SHOW_OBJECT_TOOLTIP = 'SHOW_OBJECT_TOOLTIP';
export const HIDE_OBJECT_TOOLTIP = 'HIDE_OBJECT_TOOLTIP';

export const SHOW_OBJECT_INFO = 'SHOW_OBJECT_INFO';
export const HIDE_OBJECT_INFO = 'HIDE_OBJECT_INFO';

export const UPDATE_OBJECT_INFO_REQUEST = 'UPDATE_OBJECT_INFO_REQUEST';
export const UPDATE_OBJECT_INFO_SUCCESS = 'UPDATE_OBJECT_INFO_SUCCESS';
export const UPDATE_OBJECT_INFO_FAILURE = 'UPDATE_OBJECT_INFO_FAILURE';

export const GET_OBJECT_INFO_REQUEST = 'GET_OBJECT_INFO_REQUEST';
export const GET_OBJECT_INFO_SUCCESS = 'GET_OBJECT_INFO_SUCCESS';
export const GET_OBJECT_INFO_FAILURE = 'GET_OBJECT_INFO_FAILURE';

export const showObjectTooltip = (coordinates, tooltipPosition) => async (dispatch, getState) => {
  const activeObject = await _getObjectByCoordinates(coordinates);

  dispatch({
    type: SHOW_OBJECT_TOOLTIP,
    payload: {
      activeObject,
      tooltipPosition
    }
  });
};

export const hideObjectTooltip = (dispatch, getState) => {
  return {
    type: HIDE_OBJECT_TOOLTIP
  }
};

export const showObjectInfoByCoordinates = (coordinates) => async (dispatch, getState) => {
  dispatch({ type: GET_OBJECT_INFO_REQUEST });

  try {
    const activeObject = await _getObjectByCoordinates(coordinates);
    history.pushState(null, null, `${ENV.static}/objects/${activeObject._id}`);

    dispatch({
      type: GET_OBJECT_INFO_SUCCESS,
      payload: {
        _id: activeObject._id
      }
    });
  } catch (e) {
    dispatch({ type: GET_OBJECT_INFO_FAILURE });
  }
};

export const showObjectInfoById = (objectId) => async (dispatch, getState) => {
  dispatch({
    type: GET_OBJECT_INFO_SUCCESS,
    payload: {
      _id: objectId
    }
  });
};

export const hideObjectInfo = (dispatch, getState) => {
  history.pushState(null, null, ENV.static);
  return {
    type: HIDE_OBJECT_INFO
  }
};

export const saveObject = (object) => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_OBJECT_INFO_REQUEST
  });

  try {
    let response = await fetch(`${ENV.api}/api/objects/${object.id}`, {
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

    setTimeout(() => {
      dispatch({ type: UPDATE_OBJECT_INFO_SUCCESS });
    }, 2000)
  } catch(e) {
    console.error(e);
    dispatch({ type: UPDATE_OBJECT_INFO_FAILURE });
  }
};

async function _getObjectByCoordinates(coordinates) {
  let response = await fetch(`${ENV.api}/api/objects?coordinates=${JSON.stringify(coordinates)}`, {
    headers: {
      'Token': localStorage.token
    }
  });

  return await response.json();
}
