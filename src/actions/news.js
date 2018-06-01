import { ENV } from '../constants';
export const GET_ALL_NEWS = 'GET_ALL_NEWS';

export const getAllNews = () => async (dispatch, getState) => {
  const response = await fetch(`${ENV.api}/api/news`);
  const all = await response.json();

  dispatch({
    type: GET_ALL_NEWS,
    all
  });
};