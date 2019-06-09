import { ENV } from '../../../environments/environments';
import { getApiHeaders } from '../../../environments/api';
import {MapConstants} from "../u-map/UMap.actions";

export const DotConstants = {
  FETCH: 'DOT_FETCH',
  PUT: 'DOT_PUT',
  DELETE: 'DOT_DELETE',
  CLEAR_STATE: 'DOT_CLEAR_STATE',
  ADD_IMAGE: 'DOT_ADD_IMAGE',
  DELETE_IMAGE: 'DOT_DELETE_IMAGE',
  CHANGE_ACTIVE_IMAGE: 'CHANGE_ACTIVE_IMAGE'
};

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
  let response = await fetch(`${ENV[window.ENV].api}/api/dots/${dotId}`, {
    headers: getApiHeaders(localStorage.token)
  });

  if (!response.ok) {
    if (response.status === 401) location.reload();
    throw new Error('Error while fetching a dot');
  }

  let dot = await response.json();
  history.pushState(null, null, `${ENV[window.ENV].static}/dots/${dot.id}`);

  return dot;
};

// -------
export const putDot = (dotToPut) => async (dispatch) => {
  dispatch({
    type: DotConstants.PUT,
    async: true,
    httpMethodToInvoke: _putDot,
    params: [dotToPut, dispatch]
  });
};

const _putDot = async (dotToPut, dispatch) => {
  let response = await fetch(`${ENV[window.ENV].api}/api/dots/${dotToPut.id}`, {
    method: 'PUT',
    headers: getApiHeaders(localStorage.token),
    body: JSON.stringify(dotToPut)
  });

  if (!response.ok) {
    throw new Error('Error while putting a dot');
  }

  let dot = await response.json();

  dispatch({ type: MapConstants.DOTS.UPDATE, payload: dot });

  return dot;
};

// -------
export const deleteDot = (dotId) => async (dispatch) => {
  dispatch({
    type: DotConstants.DELETE,
    async: true,
    httpMethodToInvoke: _deleteDot,
    params: [dotId]
  });
};

const _deleteDot = async (dotId) => {
  let response = await fetch(`${ENV[window.ENV].api}/api/dots/${dotId}`, {
    method: 'DELETE',
    headers: getApiHeaders(localStorage.token)
  });

  if (!response.ok) {
    throw new Error('Error while deleting a comment');
  }

  return dotId;
};

// -------
export const addDotImage = (decade, key) => (dispatch, getState) => {
  dispatch({
    type: DotConstants.ADD_IMAGE,
    payload: { decade, key }
  });
};

export const deleteDotImage = (decade) => (dispatch, getState) => {
  dispatch({
    type: DotConstants.DELETE_IMAGE,
    payload: { decade }
  });
};

export const changeActiveImage = (image, decade) => (dispatch, getState) => {
  dispatch({
    type: DotConstants.CHANGE_ACTIVE_IMAGE,
    payload: { image, decade }
  });
};

export const clearDotState = () => (dispatch, getState) => {
  dispatch({ type: DotConstants.CLEAR_STATE });
};