import {ENV} from '../../../environments/environments';
import {setCurrentDotId} from '../u-map/UMap.actions';
import {getApiHeaders} from '../../../environments/api';

export const AppConstants = {
  PAGE: {
    UPDATE: 'APP_PAGE_UPDATE'
  },
  USER: {
    FETCH: 'APP_USER_FETCH',
    ENABLE_ANONYMOUS_MODE: 'APP_USER_ENABLE_ANONYMOUS_MODE',
    UPDATE_AVATARS_CACHE: 'APP_USER_UPDATE_AVATARS_CACHE'
  }
};

//
// General redux actions
//
export const fetchUserInfo = () => async (dispatch) => {
  dispatch({
    type: AppConstants.USER.FETCH,
    async: true,
    httpMethodToInvoke: _fetchUserInfo,
    params: []
  });
};

const _fetchUserInfo = async () => {
  let response = await fetch(`${ENV[window.ENV].api}/api/user`, {
    method: 'GET',
    headers: getApiHeaders(localStorage.token)
  });

  let avatar = '';

  const user = await response.json();

  if (!response.ok) {
    if (response.status === 401) location.reload();
    throw new Error('Error while fetching comments');
  }

  if (user.id) {
    avatar = await fetch(`${ENV[window.ENV].api}/api/users/${user.id}/avatar`).then(response => response.json());
  }

  return { ...user, avatar };
};

// -------
export const enableAnonymousMode = () => {
  return {
    type: AppConstants.USER.ENABLE_ANONYMOUS_MODE
  };
};

// -------
export const updateAvatarsCache = (authorVkId, avatarUrl) => {
  return {
    type: AppConstants.USER.UPDATE_AVATARS_CACHE,
    payload: { authorVkId, avatarUrl }
  };
};


//
// Routing
//
export const navigate = ({ path, meta }) => async (dispatch, getState) => {
  let page = path === '/' ? '/' : path.slice(1);

  switch (true) {
    case Router.isRootPage(page):
      // do nothing
      break;

    case Router.isDotPage(page):
      let dotId = page.split('/')[1];
      dispatch(setCurrentDotId(dotId));
      break;

    case Router.isSuccessPage(page):
      // do nothing
      break;

    default:
      // replace unknown route to 404
      page = '404';
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: AppConstants.PAGE.UPDATE,
    payload: page
  };
};

class Router {
  static isRootPage(page) {
    return page === '/';
  }
  static isSuccessPage(page) {
    return page === 'success';
  }

  static isDotPage(page) {
    return /^(dots)\/(.+)$/.test(page);
  }
}