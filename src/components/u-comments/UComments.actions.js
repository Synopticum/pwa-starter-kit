import {ENV} from '../../../environments/environments';
import {getApiHeaders} from '../../../environments/api';

export const CommentsConstants = {
  DOT_PAGE: {
    FETCH: 'COMMENTS_DOT_PAGE_FETCH',
    PUT: 'COMMENTS_DOT_PAGE_PUT',
    DELETE: 'COMMENTS_DOT_PAGE_DELETE'
  },
  OBJECT_PAGE: {
    FETCH: 'COMMENTS_OBJECT_PAGE_FETCH',
    PUT: 'COMMENTS_OBJECT_PAGE_PUT',
    DELETE: 'COMMENTS_OBJECT_PAGE_DELETE'
  }
};

// -------
export const fetchComments = (originType, id) => async (dispatch) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({
    type: CommentsConstants[pageType].FETCH,
    async: true,
    httpMethodToInvoke: _fetchComments,
    params: [originType, id, dispatch]
  });
};

const _fetchComments = async (originType, id) => {
  let response = await fetch(`${ENV[window.ENV].api}/api/${originType}/${id}/comments`, {
    headers: getApiHeaders(localStorage.token)
  });

  if (!response.ok) {
    if (response.status === 401) location.reload();
    throw new Error('Error while fetching comments');
  }

  return await response.json();
};

// -------
export const putComment = (originType, originId, comment) => async (dispatch) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({
    type: CommentsConstants[pageType].PUT,
    async: true,
    httpMethodToInvoke: _putComment,
    params: [originType, originId, comment]
  });
};

const _putComment = async (originType, originId, comment) => {
  let response = await fetch(`${ENV[window.ENV].api}/api/${originType}/${originId}/comments/${comment.id}`, {
    method: 'PUT',
    body: JSON.stringify(comment),
    headers: getApiHeaders(localStorage.token)
  });

  if (!response.ok) {
    throw new Error('Error while putting a comment');
  }

  return await response.json();
};

// -------
export const deleteComment = (originType, originId, commentId) => async (dispatch) => {
  let pageType = `${originType.toUpperCase()}_PAGE`;

  dispatch({
    type: CommentsConstants[pageType].DELETE,
    async: true,
    httpMethodToInvoke: _deleteComment,
    params: [originType, originId, commentId]
  });
};

const _deleteComment = async (originType, originId, commentId) => {
  let response = await fetch(`${ENV[window.ENV].api}/api/${originType}/${originId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getApiHeaders(localStorage.token)
  });

  if (!response.ok) {
    throw new Error('Error while deleting a comment');
  }

  return commentId;
};