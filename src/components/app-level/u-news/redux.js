//
// Action
//
import { ENV } from '../../../constants';

const GET_ALL_NEWS = 'GET_ALL_NEWS';
const GET_WEATHER = 'GET_WEATHER';
const UPDATE_MAIN_NEWS_SCROLL = 'UPDATE_MAIN_NEWS_SCROLL';

export const getAllNews = () => async (dispatch, getState) => {
  const response = await fetch(`${ENV.api}/api/news`);
  const all = await response.json();

  dispatch({
    type: GET_ALL_NEWS,
    payload: {
      ...all
    }
  });
};

export const getWeather = () => async (dispatch, getState) => {
  const response = await fetch(`${ENV.api}/api/news/weather`);
  const weather = await response.json();

  dispatch({
    type: GET_WEATHER,
    payload: {
      ...weather
    }
  });
};

export const updateMainNewsScroll = (mainNewsScroll) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_MAIN_NEWS_SCROLL,
    payload: {
      ...mainNewsScroll
    }
  });
};

//
// Reducer
//
export const news = (state = { all: [] }, action) => {
  switch (action.type) {
    case GET_ALL_NEWS:
      return {
        ...state,
        all: action.payload
      };

    case GET_WEATHER:
      return {
        ...state,
        weather: action.payload
      };

    case UPDATE_MAIN_NEWS_SCROLL:
      return {
        ...state,
        mainNewsScroll: action.payload
      };

    default:
      return state;
  }
};