//
// Action
//
import { ENV } from '../../../constants';

const PUT_DOT_REQUEST = 'PUT_DOT_REQUEST';
const PUT_DOT_SUCCESS = 'PUT_DOT_SUCCESS';
const PUT_DOT_FAILURE = 'PUT_DOT_FAILURE';

const GET_DOT_REQUEST = 'GET_DOT_REQUEST';
const GET_DOT_SUCCESS = 'GET_DOT_SUCCESS';
const GET_DOT_FAILURE = 'GET_DOT_FAILURE';

const HIDE_DOT_INFO = 'HIDE_DOT_INFO';

export const GET_DOTS_REQUEST = 'GET_DOTS_REQUEST';
export const GET_DOTS_SUCCESS = 'GET_DOTS_SUCCESS';
export const GET_DOTS_FAILURE = 'GET_DOTS_FAILURE';

export const UPDATE_DOTS = 'UPDATE_DOTS';

export const getDotInfoById = dotId => async (dispatch, getState) => {
  dispatch({ type: GET_DOT_REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/dots/${dotId}`, { headers: { 'Token': localStorage.token } });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: GET_DOT_FAILURE });
    }

    let activeDot = await response.json();
    history.pushState(null, null, `${ENV.static}/dots/${activeDot.id}`);

    dispatch({
      type: GET_DOT_SUCCESS,
      payload: activeDot
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: GET_DOT_FAILURE });
  }
};

export const putDot = dot => async (dispatch, getState) => {
  dispatch({
    type: PUT_DOT_REQUEST,
    payload: dot
  });

  try {
    let response = await fetch(`${ENV.api}/api/dots/${dot.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.token
      },
      body: JSON.stringify(dot)
    });

    if (!response.ok) {
      return dispatch({ type: PUT_DOT_FAILURE });
    }

    let activeDot = await response.json();

    dispatch({
      type: PUT_DOT_SUCCESS,
      payload: activeDot
    });

    dispatch({
      type: UPDATE_DOTS,
      payload: activeDot
    });
  } catch(e) {
    console.error(e);
    dispatch({ type: PUT_DOT_FAILURE });
  }
};

export const hideDotInfo = (dispatch, getState) => {
  history.pushState(null, null, ENV.static);
  return {
    type: HIDE_DOT_INFO
  }
};


export const getDots = () => async (dispatch, getState) => {
  dispatch({ type: GET_DOTS_REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/dots`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: GET_DOTS_FAILURE });
    }

    let dots = await response.json();

    dispatch({
      type: GET_DOTS_SUCCESS,
      payload: dots
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: GET_DOTS_FAILURE });
  }
};

//
// Reducer
//
export const dot = (state = {
  activeDot: {},
  isFetching: false,
  isUpdating: false,
  isVisible: false
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
        isVisible: true,
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

    case HIDE_DOT_INFO:
      return {
        ...state,
        isVisible: false
      };
  }
};

export const dots = (state = {
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

    case UPDATE_DOTS:
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    default:
      return state;
  }
};
