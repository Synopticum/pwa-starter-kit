import { ENV } from '../../constants';

export const GET_DOTS_REQUEST = 'GET_DOTS_REQUEST';
export const GET_DOTS_SUCCESS = 'GET_DOTS_SUCCESS';
export const GET_DOTS_FAILURE = 'GET_DOTS_FAILURE';

export const getDots = dotId => async (dispatch, getState) => {
  dispatch({ type: GET_DOTS_REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/dots`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: GET_DOTS_FAILURE });
    }

    let dots = await response.json();

    dispatch({
      type: GET_DOTS_SUCCESS,
      payload: dots
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: GET_DOTS_FAILURE });
  }
};