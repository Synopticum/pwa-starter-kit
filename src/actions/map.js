export const SHOW_OBJECT_TOOLTIP = 'SHOW_OBJECT_TOOLTIP';

export const showObjectTooltip = (latLngs) => async (dispatch, getState) => {
  const object = await _getObjectByLatLngs(latLngs);

  dispatch({
    type: SHOW_OBJECT_TOOLTIP,
    objectTooltip: object
  });
};

async function _getObjectByLatLngs(latLngs) {
  let coordinates = latLngs.map(item => {
    return [item.lat, item.lng];
  });

  let response = await fetch(`http://localhost:3000/api/objects?coordinates=${JSON.stringify(coordinates)}`, {
    headers: {
      'vk-access-token': localStorage.access_token
    }
  });

  return await response.json();
}
