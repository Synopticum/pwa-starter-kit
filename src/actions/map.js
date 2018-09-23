import { ENV } from '../../constants';
import { GET_OBJECT_INFO_FAILURE, GET_OBJECT_INFO_REQUEST, GET_OBJECT_INFO_SUCCESS } from './object';

export const GET_OBJECT_TOOLTIP_REQUEST = 'GET_OBJECT_TOOLTIP_REQUEST';
export const GET_OBJECT_TOOLTIP_SUCCESS = 'GET_OBJECT_TOOLTIP_SUCCESS';
export const GET_OBJECT_TOOLTIP_FAILURE = 'GET_OBJECT_TOOLTIP_FAILURE';

export const HIDE_OBJECT_TOOLTIP = 'HIDE_OBJECT_TOOLTIP';

export const showObjectTooltip = (objectId, tooltipPosition) => async (dispatch, getState) => {
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