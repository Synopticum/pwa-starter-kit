//
// Action
//
import { ENV } from '../../../constants';

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
  HIDE: 'DOT_HIDE'
};

const DOTS = {
  GET: {
    REQUEST: 'DOTS_GET_REQUEST',
    SUCCESS: 'DOTS_GET_SUCCESS',
    FAILURE: 'DOTS_GET_FAILURE'
  },
  UPDATE: 'DOTS_UPDATE'
};

export const getDotInfoById = dotId => async (dispatch, getState) => {
  dispatch({ type: DOT.GET.REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/dots/${dotId}`, { headers: { 'Token': localStorage.token } });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: DOT.GET.FAILURE });
    }

    let activeDot = await response.json();
    history.pushState(null, null, `${ENV.static}/dots/${activeDot.id}`);

    dispatch({
      type: DOT.GET.SUCCESS,
      payload: activeDot
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: DOT.GET.FAILURE });
  }
};

export const putDot = dot => async (dispatch, getState) => {
  dispatch({
    type: DOT.PUT.SUCCESS,
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
      return dispatch({ type: DOT.PUT.FAILURE });
    }

    let activeDot = await response.json();

    dispatch({
      type: DOT.PUT.SUCCESS,
      payload: activeDot
    });

    dispatch({
      type: DOTS.UPDATE,
      payload: activeDot
    });
  } catch(e) {
    console.error(e);
    dispatch({ type: DOT.PUT.FAILURE });
  }
};

export const hideDotInfo = (dispatch, getState) => {
  history.pushState(null, null, ENV.static);
  return {
    type: DOT.HIDE
  }
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
export const dot = (state = {
  activeDot: {},
  isFetching: false,
  isUpdating: false,
  isVisible: false
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
        isVisible: true,
        activeDot: action.payload
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
        activeDot: action.payload
      };

    case DOT.PUT.FAILURE:
      return {
        ...state,
        isUpdating: false
      };
    default:
      return state;

    case DOT.HIDE:
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
