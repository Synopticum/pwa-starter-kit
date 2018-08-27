import { ENV } from '../../constants';
export const GET_ALL_NEWS = 'GET_ALL_NEWS';
export const GET_WEATHER = 'GET_WEATHER';

export const getAllNews = () => async (dispatch, getState) => {
  const response = await fetch(`${ENV.api}/api/news`);
  const all = await response.json();

  dispatch({
    type: GET_ALL_NEWS,
    all
  });
};

export const getWeather = () => async (dispatch, getState) => {
  const response = await fetch(`${ENV.api}/api/news/weather`);
  const weather = await response.json();

  dispatch({
    type: GET_WEATHER,
    weather
  });
};