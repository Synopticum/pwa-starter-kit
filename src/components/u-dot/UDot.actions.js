import { ENV } from '../../../environments/environments';
import {MapConstants} from "../u-map/UMap.actions";

export const DotConstants = Object.freeze({
  FETCH: 'DOT_FETCH',
  PUT: 'DOT_PUT',
  CLEAR_STATE: 'DOT_CLEAR_STATE'
});

// -------
export const fetchDot = (dotId) => async (dispatch) => {
  dispatch({
    type: DotConstants.FETCH,
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
    type: DotConstants.FETCH,
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

    dispatch({ type: MapConstants.DOTS.UPDATE, payload: dot });

    return dot;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const clearDotState = () => (dispatch, getState) => {
  dispatch({ type: DotConstants.CLEAR_STATE });
};