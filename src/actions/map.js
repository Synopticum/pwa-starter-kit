import { ENV } from '../../constants';

export const SHOW_OBJECT_TOOLTIP = 'SHOW_OBJECT_TOOLTIP';
export const HIDE_OBJECT_TOOLTIP = 'HIDE_OBJECT_TOOLTIP';

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

async function _getObjectByCoordinates(coordinates) {
  let response = await fetch(`${ENV.api}/api/objects?coordinates=${JSON.stringify(coordinates)}`, {
    headers: {
      'Token': localStorage.token
    }
  });

  return await response.json();
}
