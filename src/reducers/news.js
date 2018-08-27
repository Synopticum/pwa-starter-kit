import { GET_ALL_NEWS, GET_WEATHER } from '../actions/news.js';

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
    default:
      return state;
  }
};

export default news;