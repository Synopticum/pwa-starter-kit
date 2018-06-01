import { ENV } from '../constants';

export const SHOW_OBJECT_TOOLTIP = 'SHOW_OBJECT_TOOLTIP';
export const HIDE_OBJECT_TOOLTIP = 'HIDE_OBJECT_TOOLTIP';
export const SHOW_OBJECT_INFO = 'SHOW_OBJECT_INFO';
export const HIDE_OBJECT_INFO = 'HIDE_OBJECT_INFO';
export const SHOW_OBJECT_EDITOR = 'SHOW_OBJECT_EDITOR';
export const HIDE_OBJECT_EDITOR = 'HIDE_OBJECT_EDITOR';

export const showObjectTooltip = (coordinates, position) => async (dispatch, getState) => {
  const object = await _getObjectByCoordinates(coordinates);

  dispatch({
    type: SHOW_OBJECT_TOOLTIP,
    object,
    position
  });
};

export const hideObjectTooltip = (dispatch, getState) => {
  return {
    type: HIDE_OBJECT_TOOLTIP
  }
};

export const showObjectInfo = (coordinates) => async (dispatch, getState) => {
  const object = await _getObjectByCoordinates(coordinates);

  dispatch({
    type: SHOW_OBJECT_INFO,
    object
  });
};

export const hideObjectInfo = (dispatch, getState) => {
  return {
    type: HIDE_OBJECT_INFO
  }
};

export const showObjectEditor = (coordinates) => async (dispatch, getState) => {
  const object = await _getObjectByCoordinates(coordinates);

  dispatch({
    type: SHOW_OBJECT_EDITOR,
    object
  });
};

export const hideObjectEditor = (dispatch, getState) => {
  return {
    type: HIDE_OBJECT_EDITOR
  }
};

async function _getObjectByCoordinates(coordinates) {
  let response = await fetch(`${ENV.api}/api/objects?coordinates=${JSON.stringify(coordinates)}`, {
    headers: {
      'vk-access-token': localStorage.access_token
    }
  });

  return await response.json();
}
