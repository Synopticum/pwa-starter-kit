//
// Action
//
import { ENV } from '../../../environments/environments';

export const TOOLTIP = {
  GET: {
    REQUEST: 'TOOLTIP_GET_REQUEST',
    SUCCESS: 'TOOLTIP_GET_SUCCESS',
    FAILURE: 'TOOLTIP_GET_FAILURE',
  }
};

export const TOGGLE = {
  TOOLTIP: 'TOGGLE_TOOLTIP',
  CONTEXT_MENU: 'TOGGLE_CONTEXT_MENU',
  DOT_CREATOR: 'TOGGLE_DOT_CREATOR',
  CLOUDS: 'TOGGLE_CLOUDS'
};

export const DOT_PAGE = {
  SET_ID: 'DOT_PAGE_SET_ID'
};

export const MAP = {
  DOTS: {
    FETCH: 'MAP_DOTS_FETCH',
    UPDATE: 'MAP_DOTS_UPDATE'
  }
};

// -------
export const fetchDots = () => async (dispatch) => {
  dispatch({
    type: MAP.DOTS.FETCH,
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
export const toggleTooltip = (enable, id, position = {}) => async (dispatch, getState) => {
  if (enable) {
    dispatch({ type: TOOLTIP.GET.REQUEST });

    try {
      const type = 'dot';
      const item = await _getById(id, type, dispatch);

      dispatch({
        type: TOOLTIP.GET.SUCCESS,
        payload: {
          item,
          position
        }
      });

      dispatch({
        type: TOGGLE.TOOLTIP,
        payload: true
      });
    } catch (e) {
      dispatch({ type: TOOLTIP.GET.FAILURE });
    }
  } else {
    dispatch({
      type: TOGGLE.TOOLTIP,
      payload: false
    })
  }
};

const _getById = async (id, type, dispatch) => {
  let response = await fetch(`${ENV[window.ENV].api}/api/${type}s/${id}`, {
    headers: {
      'Token': localStorage.token
    }
  });

  if (!response.ok) {
    if (response.status === 401) location.reload();
    return dispatch({ type: TOOLTIP.GET.FAILURE });
  }

  return await response.json();
};

export const toggleContextMenu = (isVisible, position = {}) => {
  return {
    type: TOGGLE.CONTEXT_MENU,
    payload: {
      isVisible,
      position
    }
  }
};

export const toggleDotCreator = (isVisible, position = {}) => {
  return {
    type: TOGGLE.DOT_CREATOR,
    payload: {
      isVisible,
      position
    }
  }
};

export const setCloudsVisibility = (visibility = {}) => {
  return {
    type: TOGGLE.CLOUDS,
    payload: {
      visibility
    }
  }
};

export const setCurrentDotId = (dotId) => (dispatch, getState) => {
  if (!dotId) history.pushState(null, null, ENV[window.ENV].static);

  dispatch({
    type: DOT_PAGE.SET_ID,
    payload: dotId
  });
};

