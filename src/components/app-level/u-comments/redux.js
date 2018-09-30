//
// Action
//
import { ENV } from '../../../constants';

export const COMMENTS = {
  OBJECT_PAGE: {
    GET: {
      REQUEST: 'OBJECT_GET_REQUEST',
      SUCCESS: 'OBJECT_GET_SUCCESS',
      FAILURE: 'OBJECT_GET_FAILURE'
    }
  }
};

export const getComments = (type, id) => async (dispatch, getState) => {
  dispatch({ type: COMMENTS.OBJECT_PAGE.GET.REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/${type}/${id}/comments`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: COMMENTS.OBJECT_PAGE.GET.FAILURE });
    }

    let comments = await response.json();

    dispatch({
      type: COMMENTS.OBJECT_PAGE.GET.SUCCESS,
      payload: comments
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: COMMENTS.OBJECT_PAGE.GET.FAILURE });
  }
};

//
// Reducer
//
export const comments = (state = {}, action) => {
  switch (action.type) {
    case COMMENTS.OBJECT_PAGE.GET.REQUEST:
      return {
        ...state,
        objectPage: action.payload,
        isFetching: true
      };

    case COMMENTS.OBJECT_PAGE.GET.SUCCESS:
      return {
        ...state,
        objectPage: action.payload,
        isFetching: false
      };

    case COMMENTS.OBJECT_PAGE.GET.FAILURE:
      return {
        ...state,
        isFetching: false
      };

    default:
      return state;
  }
};