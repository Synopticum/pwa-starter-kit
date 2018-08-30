import { GET_ALL_NEWS, GET_WEATHER, UPDATE_MAIN_NEWS_SCROLL } from '../actions/news.js';

const news = (state = { all: [] }, action) => {
  switch (action.type) {
    case GET_ALL_NEWS:
      return {
        ...state,
        all: action.all
      };

    case GET_WEATHER:
      return {
        ...state,
        weather: action.weather
      };

    case UPDATE_MAIN_NEWS_SCROLL:
      return {
        ...state,
        mainNewsScroll: action.mainNewsScroll
      };

    default:
      return state;
  }
};

export default news;