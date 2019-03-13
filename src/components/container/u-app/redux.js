//
// Action
//
import { ENV } from '../../../constants';
import { setCurrentObjectId, setCurrentDotId } from '../u-map/redux';

const PAGE = {
  UPDATE: 'PAGE_UPDATE'
};

const USER = {
  GET: 'USER_GET'
};

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? '/' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));
};

const loadPage = (page) => async (dispatch, getState) => {
  await import('../u-map/u-map.js');
  import('../../presentational/u-context-menu/u-context-menu.js');
  import('../../presentational/u-textbox/u-textbox.js');

  import('../u-dot-tooltip/u-dot-tooltip.js');

  import('../u-dot/u-dot.js');
  import('../u-dot-creator/u-dot-creator.js');

  import('../u-comments/u-comments.js');
  import('../u-comments/u-comment/u-comment.js');

  switch (true) {
    case (page === '/'):
      break;

    case (/^(dots)\/(.+)$/.test(page)):
      dispatch(setCurrentDotId(page.split('/')[1]));
      break;

    case (page === 'success'):
      // do nothing
      break;

    default:
      page = '404';
      import('../../presentational/u-404.js');
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: PAGE.UPDATE,
    payload: {
      page
    }
  };
};

export const getUserInfo = () => async (dispatch, getState) => {
  let response = await fetch(`${ENV.api}/api/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.token
    }
  });
  const info = await response.json();

  dispatch({
    type: USER.GET,
    payload: {
      ...info,
      isAdmin: info.role === 'admin'
    }
  });
};

//
// Reducer
//
export const app = (state = {}, action) => {
  switch (action.type) {
    case PAGE.UPDATE:
      return {
        ...state,
        page: action.payload.page
      };

    case USER.GET:
      return {
        ...state,
        user: action.payload
      };

    default:
      return state;
  }
};