import {ENV} from '../../../environments/environments';
import {getApiHeaders} from '../../../environments/api';

export const MapConstants = {
  DOTS: {
    FETCH: 'MAP_DOTS_FETCH',
    UPDATE: 'MAP_DOTS_UPDATE'
  },

  OBJECTS: {
    FETCH: 'MAP_OBJECTS_FETCH',
    UPDATE: 'MAP_OBJECTS_UPDATE',
    THROW_ERROR: 'MAP_OBJECTS_THROW_ERROR'
  },

  PATHS: {
    FETCH: 'MAP_PATHS_FETCH',
    UPDATE: 'MAP_PATHS_UPDATE',
    THROW_ERROR: 'MAP_PATHS_THROW_ERROR'
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
  },

  OBJECT_PAGE: {
      SET_ID: 'OBJECT_PAGE_SET_ID'
  },

  PATH_PAGE: {
    SET_ID: 'PATH_PAGE_SET_ID'
  },

  SETTINGS: {
    SET: 'MAP_SETTINGS_SET'
  }
};

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
  let response = await fetch(`${ENV[window.ENV].api}/api/dots`, {
    headers: getApiHeaders(localStorage.token)
  });

  if (!response.ok) {
    if (response.status === 401) location.reload();
    throw new Error('Error while fetching dots');
  }

  return await response.json();
};

// -------
export const toggleTooltip = (type, enable, id, coordinates = { position: {}, origin: ''}) => async (dispatch) => {
  if (enable) {
    dispatch({
      type: MapConstants.TOOLTIP.FETCH,
      async: true,
      httpMethodToInvoke: _fetchById,
      params: [type, enable, id, coordinates, dispatch]
    });
  } else {
    dispatch({
      type: MapConstants.TOGGLE.TOOLTIP,
      payload: false
    });
  }
};

const _fetchById = async (type, enable, id, coordinates, dispatch) => {
  let response = await fetch(`${ENV[window.ENV].api}/api/${type}s/${id}`, {
    headers: getApiHeaders(localStorage.token)
  });

  if (!response.ok) {
    if (response.status === 401) location.reload();
    throw new Error(`Error while fetching a ${type}`);
  }

  let item = await response.json();

  dispatch({ type: MapConstants.TOGGLE.TOOLTIP, payload: true });
  return { item, coordinates };
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

export const setCurrentObjectId = (objectId) => (dispatch) => {
    if (!objectId) history.pushState(null, null, ENV[window.ENV].static);

    dispatch({
        type: MapConstants.OBJECT_PAGE.SET_ID,
        payload: objectId
    });
};

export const setCurrentPathId = (pathId) => (dispatch) => {
  if (!pathId) history.pushState(null, null, ENV[window.ENV].static);

  dispatch({
    type: MapConstants.PATH_PAGE.SET_ID,
    payload: pathId
  });
};

export const setSettings = (setting, value) => {
  return {
    type: MapConstants.SETTINGS.SET,
    payload: {
      [setting]: value
    }
  }
};

// -------
export const fetchObjects = () => async (dispatch) => {
  dispatch({
    type: MapConstants.OBJECTS.FETCH,
    async: true,
    httpMethodToInvoke: _fetchObjects,
    params: []
  });
};

const _fetchObjects = async () => {
  let response = await fetch(`${ENV[window.ENV].api}/api/objects`, {
    headers: getApiHeaders(localStorage.token)
  });

  if (!response.ok) {
    if (response.status === 401) location.reload();
    throw new Error('Error while fetching objects');
  }

  return await response.json();
};

// -------
export const fetchPaths = () => async (dispatch) => {
  dispatch({
    type: MapConstants.PATHS.FETCH,
    async: true,
    httpMethodToInvoke: _fetchPaths,
    params: []
  });
};

const _fetchPaths = async () => {
  let response = await fetch(`${ENV[window.ENV].api}/api/paths`, {
    headers: getApiHeaders(localStorage.token)
  });

  if (!response.ok) {
    if (response.status === 401) location.reload();
    throw new Error('Error while fetching paths');
  }

  return await response.json();
};


