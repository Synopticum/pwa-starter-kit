//
// Action
//
import { ENV } from '../../../environments/environments';
import {COMMENTS} from "../u-comments/UComments.actions";

export const DOT = {
  FETCH: 'DOT_FETCH',
  PUT: 'DOT_PUT',
  CLEAR_STATE: 'DOT_CLEAR_STATE'
};

export const DOTS = {
  GET: {
    REQUEST: 'DOTS_GET_REQUEST',
    SUCCESS: 'DOTS_GET_SUCCESS',
    FAILURE: 'DOTS_GET_FAILURE'
  },
  UPDATE: 'DOTS_UPDATE'
};

// -------
export const fetchDot = (dotId) => async (dispatch) => {
  dispatch({
    type: DOT.FETCH,
    async: true,
    httpMethodToInvoke: _fetchDot,
    params: [dotId]
  });
};

const _fetchDot = async (dotId) => {
  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/dots/${dotId}`, { headers: { 'Token': localStorage.token } });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      throw new Error('Error while fetching a dot');
    }

    let dot = await response.json();
    history.pushState(null, null, `${ENV[window.ENV].static}/dots/${dot.id}`);

    return dot;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// -------
export const putDot = (dotToPut) => async (dispatch) => {
  dispatch({
    type: DOT.FETCH,
    async: true,
    httpMethodToInvoke: _putDot,
    params: [dotToPut, dispatch]
  });
};

const _putDot = async (dotToPut, dispatch) => {
  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/dots/${dotToPut.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.token
      },
      body: JSON.stringify(dotToPut)
    });

    if (!response.ok) {
      throw new Error('Error while putting a dot');
    }

    let dot = await response.json();

    dispatch({ type: DOTS.UPDATE, payload: dot });

    return dot;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const clearDotState = () => (dispatch, getState) => {
  dispatch({ type: DOT.CLEAR_STATE });
};

export const getDots = () => async (dispatch, getState) => {
  dispatch({ type: DOTS.GET.REQUEST });

  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/dots`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: DOTS.GET.FAILURE });
    }

    let dots = await response.json();

    dispatch({
      type: DOTS.GET.SUCCESS,
      payload: dots
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: DOTS.GET.FAILURE });
  }
};