import { ENV } from '../../../environments/environments';
import { setCurrentDotId } from '../u-map/UMap.actions';
import { getApiHeaders } from '../../../environments/api';

export const AppConstants = {
  PAGE: {
    UPDATE: 'APP_PAGE_UPDATE'
  },
  USER: {
    FETCH: 'APP_USER_FETCH',
    ENABLE_ANONYMOUS_MODE: 'APP_USER_ENABLE_ANONYMOUS_MODE'
  }
};

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? '/' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));
};

const loadPage = (page) => async (dispatch, getState) => {
  await import('../u-map/UMap.js');

  import('../u-default-spinner/UDefaultSpinner.js');
  import('../u-context-menu/UContextMenu.js');
  import('../u-textbox/UTextbox.js');
  import('../u-textarea/UTextarea.js');
  import('../u-round-button/URoundButton.js');
  import('../u-tooltip/UTooltip.js');

  import('../u-dot/UDot.js');
  import('../u-dot-creator/UDotCreator.js');

  import('../u-comments/UComments.js');
  import('../u-comment/UComment.js');

  import('../u-photo-upload/UPhotoUpload.js');

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
      import('../u-404/U404.js');
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: AppConstants.PAGE.UPDATE,
    payload: page
  };
};


// -------
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

  const info = await response.json();

  if (!response.ok) {
    if (response.status === 401) location.reload();
    throw new Error('Error while fetching comments');
  }

  return info;
};

// -------
export const enableAnonymousMode = () => {
  return {
    type: AppConstants.USER.ENABLE_ANONYMOUS_MODE
  };
};