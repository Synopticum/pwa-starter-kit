import { ENV } from '../../constants';

export const GET_OBJECT_TOOLTIP_REQUEST = 'GET_OBJECT_TOOLTIP_REQUEST';
export const GET_OBJECT_TOOLTIP_SUCCESS = 'GET_OBJECT_TOOLTIP_SUCCESS';
export const GET_OBJECT_TOOLTIP_FAILURE = 'GET_OBJECT_TOOLTIP_FAILURE';

export const HIDE_OBJECT_TOOLTIP = 'HIDE_OBJECT_TOOLTIP';

export const showObjectTooltip = (coordinates, tooltipPosition) => async (dispatch, getState) => {
  dispatch({ type: GET_OBJECT_TOOLTIP_REQUEST });

  try {
    const activeObject = await _getObjectByCoordinates(coordinates);

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

async function _getObjectByCoordinates(coordinates) {
  let response = await fetch(`${ENV.api}/api/objects?coordinates=${JSON.stringify(coordinates)}`, {
    headers: {
      'Token': localStorage.token
    }
  });

  return await response.json();
}
