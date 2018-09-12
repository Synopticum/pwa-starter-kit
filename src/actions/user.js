import { ENV } from '../../constants';
export const GET_USER = 'GET_USER';

export const getUserInfo = () => async (dispatch, getState) => {
  let response = await fetch(`${ENV.api}/api/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.token
    }
  });
  const info = await response.json();

  dispatch({
    type: GET_USER,
    payload: {
      ...info
    }
  });
};