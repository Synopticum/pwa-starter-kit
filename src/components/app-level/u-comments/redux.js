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
  },
  DOT_PAGE: {
    GET: {
      REQUEST: 'COMMENTS_DOT_PAGE_GET_REQUEST',
      SUCCESS: 'COMMENTS_DOT_PAGE_GET_SUCCESS',
      FAILURE: 'COMMENTS_DOT_PAGE_GET_FAILURE'
    },
    PUT: {
      REQUEST: 'COMMENTS_DOT_PAGE_PUT_REQUEST',
      SUCCESS: 'COMMENTS_DOT_PAGE_PUT_SUCCESS',
      FAILURE: 'COMMENTS_DOT_PAGE_PUT_FAILURE'
    },
    TYPE: 'COMMENTS_DOT_PAGE_TYPE'
  }
};

export const getComments = (originType, id) => async (dispatch, getState) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({ type: COMMENTS[pageType].GET.REQUEST });

  try {
    let response = await fetch(`${ENV.api}/api/${originType}/${id}/comments`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      return dispatch({ type: COMMENTS[pageType].GET.FAILURE });
    }

    let items = await response.json();

    dispatch({
      type: COMMENTS[pageType].GET.SUCCESS,
      payload: items
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: COMMENTS[pageType].GET.FAILURE });
  }
};

export const putComment = (originType, originId, comment) => async (dispatch, getState) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({ type: COMMENTS[pageType].PUT.REQUEST });

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
      return dispatch({ type: COMMENTS[pageType].PUT.FAILURE });
    }

    let item = await response.json();

    dispatch({
      type: COMMENTS[pageType].PUT.SUCCESS,
      payload: item
    });
  } catch(e) {
    console.error(e);
    dispatch({ type: COMMENTS[pageType].PUT.FAILURE });
  }
};

export const typeComment = (originType, currentMessage) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  return {
    type: COMMENTS[pageType].TYPE,
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
  },
  dotPage: {
    items: [],
    isFetching: false,
    isUpdating: false,
    currentMessage: ''
  }, }, action) => {
  switch (action.type) {
    // object page
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

    // dot page
    case COMMENTS.DOT_PAGE.GET.REQUEST:
      return Object.assign({}, state, {
        ...state,
        dotPage: {
          ...state.dotPage,
          isFetching: true
        }
      });

    case COMMENTS.DOT_PAGE.GET.SUCCESS:
      return Object.assign({}, state, {
        dotPage: {
          ...state.dotPage,
          items: action.payload,
          isFetching: false
        }
      });

    case COMMENTS.DOT_PAGE.GET.FAILURE:
      return Object.assign({}, state, {
        ...state,
        dotPage: {
          ...state.dotPage,
          isFetching: false
        }
      });

    case COMMENTS.DOT_PAGE.PUT.REQUEST:
      return Object.assign({}, state, {
        ...state,
        dotPage: {
          ...state.dotPage,
          isUpdating: true
        }
      });

    case COMMENTS.DOT_PAGE.PUT.SUCCESS:
      return Object.assign({}, state, {
        dotPage: {
          ...state.dotPage,
          items: [...state.dotPage.items, action.payload],
          isUpdating: false,
          currentMessage: ''
        }
      });

    case COMMENTS.DOT_PAGE.PUT.FAILURE:
      return Object.assign({}, state, {
        ...state,
        dotPage: {
          ...state.dotPage,
          isUpdating: false
        }
      });

    case COMMENTS.DOT_PAGE.TYPE:
      return Object.assign({}, state, {
        ...state,
        dotPage: {
          ...state.dotPage,
          currentMessage: action.payload
        }
      });

    default:
      return state;
  }
};