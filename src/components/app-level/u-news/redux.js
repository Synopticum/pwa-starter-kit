//
// Action
//
import { ENV } from '../../../constants';

const NEWS = {
  GET: 'NEWS_GET',
  UPDATE_SCROLL: 'NEWS_UPDATE_SCROLL'
};

const WEATHER = {
  GET: 'WEATHER_GET'
};

export const getAllNews = () => async (dispatch, getState) => {
  const response = await fetch(`${ENV.api}/api/news`);
  const all = await response.json();

  dispatch({
    type: NEWS.GET,
    payload: {
      ...all
    }
  });
};

export const getWeather = () => async (dispatch, getState) => {
  const response = await fetch(`${ENV.api}/api/news/weather`);
  const weather = await response.json();

  dispatch({
    type: WEATHER.GET,
    payload: {
      ...weather
    }
  });
};

export const updateMainNewsScroll = (mainNewsScroll) => (dispatch, getState) => {
  dispatch({
    type: NEWS.UPDATE_SCROLL,
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
    case NEWS.GET:
      return {
        ...state,
        all: action.payload
      };

    case WEATHER.GET:
      return {
        ...state,
        weather: action.payload
      };

    case NEWS.UPDATE_SCROLL:
      return {
        ...state,
        mainNewsScroll: action.payload
      };

    default:
      return state;
  }
};