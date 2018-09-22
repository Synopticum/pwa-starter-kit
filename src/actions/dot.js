import { ENV } from '../../constants';

export const PUT_DOT_REQUEST = 'PUT_DOT_REQUEST';
export const PUT_DOT_SUCCESS = 'PUT_DOT_SUCCESS';
export const PUT_DOT_FAILURE = 'PUT_DOT_FAILURE';

export const GET_DOT_REQUEST = 'GET_DOT_REQUEST';
export const GET_DOT_SUCCESS = 'GET_DOT_SUCCESS';
export const GET_DOT_FAILURE = 'GET_DOT_FAILURE';

export const putDot = dot => async (dispatch, getState) => {
  dispatch({
    type: PUT_DOT_REQUEST,
    payload: dot
  });

  try {
    let response = await fetch(`${ENV.api}/api/dots/${dot.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.token
      },
      body: JSON.stringify(dot)
    });

    if (!response.ok) {
      return dispatch({ type: PUT_DOT_FAILURE });
    }

    dispatch({
      type: PUT_DOT_SUCCESS,
      payload: await response.json()
    });
  } catch(e) {
    console.error(e);
    dispatch({ type: PUT_DOT_FAILURE });
  }
};

export const getDotInfoById = dotId => async (dispatch, getState) => {
  dispatch({
    type: GET_DOT_REQUEST
  });

  try {
    let response = await fetch(`${ENV.api}/api/dots/${dotId}`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      return dispatch({ type: GET_DOT_FAILURE });
    }

    dispatch({
      type: GET_DOT_SUCCESS,
      payload: await response.json()
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: GET_DOT_FAILURE });
  }
}