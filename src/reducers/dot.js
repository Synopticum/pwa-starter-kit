import {
  PUT_DOT_REQUEST,
  PUT_DOT_SUCCESS,
  PUT_DOT_FAILURE } from '../actions/dot';

const dot = (state = {
  isFetching: false
}, action) => {
  switch (action.type) {
    case PUT_DOT_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };

    case PUT_DOT_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        activeDot: action.payload,
        isVisible: true
      };

    case PUT_DOT_FAILURE:
      return {
        ...state,
        isUpdating: false
      };

    default:
      return state;
  }
};

export default dot;
