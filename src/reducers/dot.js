import {
  PUT_DOT_REQUEST,
  PUT_DOT_SUCCESS,
  PUT_DOT_FAILURE,
  GET_DOT_REQUEST,
  GET_DOT_SUCCESS,
  GET_DOT_FAILURE} from '../actions/dot';

const dot = (state = {
  activeDot: null,
  isUpdating: false
}, action) => {
  switch (action.type) {
    // GET
    case GET_DOT_REQUEST:
      return {
        ...state,
        isFetching: true
      };

    case GET_DOT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        activeDot: action.payload
      };

    case GET_DOT_FAILURE:
      return {
        ...state,
        isFetching: false
      };


    // CREATE/UPDATE
    case PUT_DOT_REQUEST:
      return {
        ...state,
        isUpdating: true,
        dotToBeUpdated: action.payload
      };

    case PUT_DOT_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        activeDot: action.payload
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
