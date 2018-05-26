import { GET_ALL_NEWS } from '../actions/news.js';

const news = (state = { all: [] }, action) => {
  switch (action.type) {
    case GET_ALL_NEWS:
      return {
        ...state,
        all: action.all
      };
    default:
      return state;
  }
};

export default news;