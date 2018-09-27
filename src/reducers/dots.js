import {
  GET_DOTS_REQUEST,
  GET_DOTS_SUCCESS,
  GET_DOTS_FAILURE } from '../actions/dots';

const dots = (state = {
  dots: [],
  isFetching: false
}, action) => {
  switch (action.type) {
    case GET_DOTS_REQUEST:
      return {
        ...state,
        isFetching: true
      };

    case GET_DOTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.payload
      };

    case GET_DOTS_FAILURE:
      return {
        ...state,
        isFetching: false
      };

    default:
      return state;
  }
};

export default dots;
