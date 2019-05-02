//
// Action
//
import { ENV } from '../../../environments/environments';

export const COMMENTS = {
  DOT_PAGE: {
    FETCH: 'COMMENTS_DOT_PAGE_FETCH',
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
    DELETE: {
      REQUEST: 'COMMENTS_DOT_PAGE_DELETE_REQUEST',
      SUCCESS: 'COMMENTS_DOT_PAGE_DELETE_SUCCESS',
      FAILURE: 'COMMENTS_DOT_PAGE_DELETE_FAILURE'
    },
    TYPE: 'COMMENTS_DOT_PAGE_TYPE'
  }
};

export const fetchComments = (originType, id) => async (dispatch) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({
    type: COMMENTS[pageType].FETCH,
    async: true,
    httpMethodToInvoke: _fetchComments,
    params: [originType, id, dispatch]
  });
};

const _fetchComments = async (originType, id, dispatch) => {
  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/${originType}/${id}/comments`, {
      headers: {
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      throw new Error('Error while fetching comments');
    }

    return await response.json();
  } catch (e) {
    console.error(e);
    return '';
  }
};

export const getComments = (originType, id) => async (dispatch, getState) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({
    type: COMMENTS[pageType].GET.REQUEST
  });

  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/${originType}/${id}/comments`, {
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
    let response = await fetch(`${ENV[window.ENV].api}/api/${originType}/${originId}/comments/${comment.id}`, {
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

export const deleteComment = (originType, originId, commentId) => async (dispatch, getState) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({ type: COMMENTS[pageType].DELETE.REQUEST });

  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/${originType}/${originId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      return dispatch({ type: COMMENTS[pageType].DELETE.FAILURE });
    }

    dispatch({
      type: COMMENTS[pageType].DELETE.SUCCESS,
      payload: commentId
    });
  } catch(e) {
    console.error(e);
    dispatch({ type: COMMENTS[pageType].DELETE.FAILURE });
  }
};

export const typeComment = (originType, currentMessage) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  return {
    type: COMMENTS[pageType].TYPE,
    payload: currentMessage
  }
};