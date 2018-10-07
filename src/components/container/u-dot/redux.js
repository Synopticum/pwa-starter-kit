//
// Action
//
import { ENV } from '../../../constants';
import { OBJECT } from '../u-object/redux';

const DOT = {
  GET: {
    REQUEST: 'DOT_GET_REQUEST',
    SUCCESS: 'DOT_GET_SUCCESS',
    FAILURE: 'DOT_GET_FAILURE'
  },
  PUT: {
    REQUEST: 'DOT_PUT_REQUEST',
    SUCCESS: 'DOT_PUT_SUCCESS',
    FAILURE: 'DOT_PUT_FAILURE'
  },
  CLEAR_STATE: 'DOT_CLEAR_STATE'
};

const DOTS = {
  GET: {
    REQUEST: 'DOTS_GET_REQUEST',
    SUCCESS: 'DOTS_GET_SUCCESS',
    FAILURE: 'DOTS_GET_FAILURE'
  },
  UPDATE: 'DOTS_UPDATE'
};

export const getDot = dotId => async (dispatch, getState) => {
  dispatch({ type: DOT.GET.REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/dots/${dotId}`, { headers: { 'Token': localStorage.token } });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: DOT.GET.FAILURE });
    }

    let dot = await response.json();
    history.pushState(null, null, `${ENV.static}/dots/${dot.id}`);

    dispatch({
      type: DOT.GET.SUCCESS,
      payload: dot
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: DOT.GET.FAILURE });
  }
};

export const putDot = dotToPut => async (dispatch, getState) => {
  dispatch({
    type: DOT.PUT.REQUEST,
    payload: dotToPut
  });

  try {
    let response = await fetch(`${ENV.api}/api/dots/${dotToPut.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.token
      },
      body: JSON.stringify(dotToPut)
    });

    if (!response.ok) {
      return dispatch({ type: DOT.PUT.FAILURE });
    }

    let dot = await response.json();

    dispatch({
      type: DOT.PUT.SUCCESS,
      payload: dot
    });

    dispatch({
      type: DOTS.UPDATE,
      payload: dot
    });
  } catch(e) {
    console.error(e);
    dispatch({ type: DOT.PUT.FAILURE });
  }
};

export const clearDotState = () => (dispatch, getState) => {
  dispatch({ type: DOT.CLEAR_STATE });
};

export const getDots = () => async (dispatch, getState) => {
  dispatch({ type: DOTS.GET.REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/dots`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: DOTS.GET.FAILURE });
    }

    let dots = await response.json();

    dispatch({
      type: DOTS.GET.SUCCESS,
      payload: dots
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: DOTS.GET.FAILURE });
  }
};

//
// Reducer
//
export const dotPage = (state = {
  dot: {},
  isFetching: false,
  isUpdating: false
}, action) => {
  switch (action.type) {
    // GET
    case DOT.GET.REQUEST:
      return {
        ...state,
        isFetching: true
      };

    case DOT.GET.SUCCESS:
      return {
        ...state,
        isFetching: false,
        dot: action.payload
      };

    case DOT.GET.FAILURE:
      return {
        ...state,
        isFetching: false
      };

    // CREATE/UPDATE
    case DOT.PUT.REQUEST:
      return {
        ...state,
        isUpdating: true,
        dotToBeUpdated: action.payload
      };

    case DOT.PUT.SUCCESS:
      return {
        ...state,
        isUpdating: false,
        dot: action.payload
      };

    case DOT.PUT.FAILURE:
      return {
        ...state,
        isUpdating: false
      };

    case DOT.CLEAR_STATE:
      return {
        dot: {},
        isFetching: false,
        isUpdating: false
      };

    default:
      return state;
  }
};

export const dots = (state = {
  items: [],
  isFetching: false
}, action) => {
  switch (action.type) {
    case DOTS.GET.REQUEST:
      return {
        ...state,
        isFetching: true
      };

    case DOTS.GET.SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.payload
      };

    case DOTS.GET.FAILURE:
      return {
        ...state,
        isFetching: false
      };

    case DOTS.UPDATE:
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    default:
      return state;
  }
};
