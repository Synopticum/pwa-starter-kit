//
// Action
//
import { ENV } from '../../../constants';

export const COMMENTS = {
  OBJECT_PAGE: {
    GET: {
      REQUEST: 'COMMENTS_OBJECT_PAGE_GET_REQUEST',
      SUCCESS: 'COMMENTS_OBJECT_PAGE_GET_SUCCESS',
      FAILURE: 'COMMENTS_OBJECT_PAGE_GET_FAILURE'
    },
    PUT: {
      REQUEST: 'COMMENTS_OBJECT_PAGE_PUT_REQUEST',
      SUCCESS: 'COMMENTS_OBJECT_PAGE_PUT_SUCCESS',
      FAILURE: 'COMMENTS_OBJECT_PAGE_PUT_FAILURE'
    },
    TYPE: 'COMMENTS_OBJECT_PAGE_TYPE'
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

    let items = await response.json();

    dispatch({
      type: COMMENTS.OBJECT_PAGE.GET.SUCCESS,
      payload: items
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: COMMENTS.OBJECT_PAGE.GET.FAILURE });
  }
};

export const putComment = (originType, originId, comment) => async (dispatch, getState) => {
  dispatch({
    type: COMMENTS.OBJECT_PAGE.PUT.REQUEST
  });

  try {
    let response = await fetch(`${ENV.api}/api/${originType}/${originId}/comments/${comment.id}`, {
      method: 'PUT',
      body: JSON.stringify(comment),
      headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      return dispatch({ type: COMMENTS.OBJECT_PAGE.PUT.FAILURE });
    }

    let item = await response.json();

    dispatch({
      type: COMMENTS.OBJECT_PAGE.PUT.SUCCESS,
      payload: item
    });
  } catch(e) {
    console.error(e);
    dispatch({ type: COMMENTS.OBJECT_PAGE.PUT.FAILURE });
  }
};

export const typeComment = (currentMessage) => {
  return {
    type: COMMENTS.OBJECT_PAGE.TYPE,
    payload: currentMessage
  }
};

//
// Reducer
//
export const comments = (state = {
  objectPage: {
    items: [],
    isFetching: false,
    isUpdating: false,
    currentMessage: ''
  }, }, action) => {
  switch (action.type) {
    case COMMENTS.OBJECT_PAGE.GET.REQUEST:
      return Object.assign({}, state, {
        ...state,
        objectPage: {
          ...state.objectPage,
          isFetching: true
        }
      });

    case COMMENTS.OBJECT_PAGE.GET.SUCCESS:
      return Object.assign({}, state, {
        objectPage: {
          ...state.objectPage,
          items: action.payload,
          isFetching: false
        }
      });

    case COMMENTS.OBJECT_PAGE.GET.FAILURE:
      return Object.assign({}, state, {
        ...state,
        objectPage: {
          ...state.objectPage,
          isFetching: false
        }
      });
    case COMMENTS.OBJECT_PAGE.PUT.REQUEST:
      return Object.assign({}, state, {
        ...state,
        objectPage: {
          ...state.objectPage,
          isUpdating: true
        }
      });

    case COMMENTS.OBJECT_PAGE.PUT.SUCCESS:
      return Object.assign({}, state, {
        objectPage: {
          ...state.objectPage,
          items: [...state.objectPage.items, action.payload],
          isUpdating: false,
          currentMessage: ''
        }
      });

    case COMMENTS.OBJECT_PAGE.PUT.FAILURE:
      return Object.assign({}, state, {
        ...state,
        objectPage: {
          ...state.objectPage,
          isUpdating: false
        }
      });

    case COMMENTS.OBJECT_PAGE.TYPE:
      return Object.assign({}, state, {
        ...state,
        objectPage: {
          ...state.objectPage,
          currentMessage: action.payload
        }
      });

    default:
      return state;
  }
};