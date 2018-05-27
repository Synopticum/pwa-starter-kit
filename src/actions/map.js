export const SHOW_OBJECT_TOOLTIP = 'SHOW_OBJECT_TOOLTIP';
export const HIDE_OBJECT_TOOLTIP = 'HIDE_OBJECT_TOOLTIP';

export const showObjectTooltip = (coordinates, position) => async (dispatch, getState) => {
  const object = await _getObjectByCoordinates(coordinates);

  dispatch({
    type: SHOW_OBJECT_TOOLTIP,
    objectTooltip: object,
    position
  });
};

export const hideObjectTooltip = (dispatch, getState) => {
  return {
    type: HIDE_OBJECT_TOOLTIP
  }
};

async function _getObjectByCoordinates(coordinates) {
  let response = await fetch(`http://localhost:3000/api/objects?coordinates=${JSON.stringify(coordinates)}`, {
    headers: {
      'vk-access-token': localStorage.access_token
    }
  });

  return await response.json();
}
