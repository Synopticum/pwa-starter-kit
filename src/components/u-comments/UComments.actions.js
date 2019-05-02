//
// Action
//
import { ENV } from '../../../environments/environments';

export const COMMENTS = {
  DOT_PAGE: {
    FETCH: 'COMMENTS_DOT_PAGE_FETCH',
    PUT: 'COMMENTS_DOT_PAGE_PUT',
    DELETE: 'COMMENTS_DOT_PAGE_DELETE',
    TYPE: 'COMMENTS_DOT_PAGE_TYPE'
  }
};

// -------
export const fetchComments = (originType, id) => async (dispatch) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({
    type: COMMENTS[pageType].FETCH,
    async: true,
    httpMethodToInvoke: _fetchComments,
    params: [originType, id, dispatch]
  });
};

const _fetchComments = async (originType, id) => {
  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/${originType}/${id}/comments`, {
      headers: { 'Token': localStorage.token }
    });

    if (!response.ok) {
      if (response.status === 401) location.reload();
      throw new Error('Error while fetching comments');
    }

    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

// -------
export const putComment = (originType, originId, comment) => async (dispatch) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({
    type: COMMENTS[pageType].PUT,
    async: true,
    httpMethodToInvoke: _putComment,
    params: [originType, originId, comment]
  });
};

const _putComment = async (originType, originId, comment) => {
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
      throw new Error('Error while putting a comment');
    }

    return await response.json();
  } catch(e) {
    console.error(e);
    return null;
  }
};

// -------
export const deleteComment = (originType, originId, commentId) => async (dispatch) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({
    type: COMMENTS[pageType].DELETE,
    async: true,
    httpMethodToInvoke: _deleteComment,
    params: [originType, originId, commentId]
  });
};

const _deleteComment = async (originType, originId, commentId) => {
  try {
    let response = await fetch(`${ENV[window.ENV].api}/api/${originType}/${originId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.token
      }
    });

    if (!response.ok) {
      throw new Error('Error while deleting a comment');
    }

    return commentId;
  } catch(e) {
    console.error(e);
    return null;
  }
};

// -------
export const typeComment = (originType, currentMessage) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  return {
    type: COMMENTS[pageType].TYPE,
    payload: currentMessage
  }
};