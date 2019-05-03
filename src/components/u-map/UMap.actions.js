import { ENV } from '../../../environments/environments';

export const MapConstants = Object.freeze({
  DOTS: {
    FETCH: 'MAP_DOTS_FETCH',
    UPDATE: 'MAP_DOTS_UPDATE'
  },

  TOOLTIP: {
    FETCH: 'MAP_TOOLTIP_FETCH'
  },

  TOGGLE: {
    TOOLTIP: 'MAP_TOGGLE_TOOLTIP',
    CONTEXT_MENU: 'MAP_TOGGLE_CONTEXT_MENU',
    DOT_CREATOR: 'MAP_TOGGLE_DOT_CREATOR',
    CLOUDS: 'MAP_TOGGLE_CLOUDS'
  },

  DOT_PAGE: {
    SET_ID: 'DOT_PAGE_SET_ID'
  }
});

// -------
export const fetchDots = () => async (dispatch) => {
  dispatch({
    type: MapConstants.DOTS.FETCH,
    async: true,
    httpMethodToInvoke: _fetchDots,
    params: []
  });
};

const _fetchDots = async () => {
  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/dots`, {
      headers: { 'Token': localStorage.token }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      throw new Error('Error while fetching dots');
    }

    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

// -------
export const toggleTooltip = (enable, id, position = {}) => async (dispatch) => {
  if (enable) {
    dispatch({
      type: MapConstants.TOOLTIP.FETCH,
      async: true,
      httpMethodToInvoke: _fetchById,
      params: [enable, id, position, dispatch]
    });
  } else {
    dispatch({
      type: MapConstants.TOGGLE.TOOLTIP,
      payload: false
    });
  }
};

const _fetchById = async (enable, id, position, dispatch) => {
  // TODO: dehardcode type
  const type = 'dot';

  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/${type}s/${id}`, {
      headers: { 'Token': localStorage.token }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      throw new Error(`Error while fetching a ${type}`);
    }

    let item = await response.json();

    dispatch({ type: MapConstants.TOGGLE.TOOLTIP, payload: true });
    return { item, position };
  } catch (e) {
    console.error(e);
    return null;
  }
};

// -------
export const toggleContextMenu = (isVisible, position = {}) => {
  return {
    type: MapConstants.TOGGLE.CONTEXT_MENU,
    payload: {
      isVisible,
      position
    }
  }
};

export const toggleDotCreator = (isVisible, position = {}) => {
  return {
    type: MapConstants.TOGGLE.DOT_CREATOR,
    payload: {
      isVisible,
      position
    }
  }
};

export const setCloudsVisibility = (visibility = {}) => {
  return {
    type: MapConstants.TOGGLE.CLOUDS,
    payload: {
      visibility
    }
  }
};

export const setCurrentDotId = (dotId) => (dispatch) => {
  if (!dotId) history.pushState(null, null, ENV[window.ENV].static);

  dispatch({
    type: MapConstants.DOT_PAGE.SET_ID,
    payload: dotId
  });
};

