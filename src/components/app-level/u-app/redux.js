//
// Action
//
import { ENV } from '../../../constants';
import { setCurrentObjectId, setCurrentDotId } from '../../../components/app-level/u-map/redux';

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

const CONTAINER_COMPONENTS_PATH = '../../../components/app-level';
const PRESENTATIONAL_COMPONENTS_PATH = '../../../components/reusable';

const loadPage = (page) => async (dispatch, getState) => {
  await import(`${CONTAINER_COMPONENTS_PATH}/u-map/u-map.js`);
  import(`${PRESENTATIONAL_COMPONENTS_PATH}/u-context-menu/u-context-menu.js`);

  import(`${CONTAINER_COMPONENTS_PATH}/u-object-tooltip/u-object-tooltip.js`);
  import(`${CONTAINER_COMPONENTS_PATH}/u-object/u-object.js`);

  import(`${CONTAINER_COMPONENTS_PATH}/u-dot/u-dot.js`);
  import(`${CONTAINER_COMPONENTS_PATH}/u-dot-creator/u-dot-creator.js`);

  import(`${CONTAINER_COMPONENTS_PATH}/u-comments/u-comments.js`);

  switch (true) {
    case (page === '/'):
      break;
    case (/^(objects)\/(.+)$/.test(page)):
      dispatch(setCurrentObjectId(page.split('/')[1]));
      break;
    case (/^(dots)\/(.+)$/.test(page)):
      dispatch(setCurrentDotId(page.split('/')[1]));
      break;
    case (page === 'success'):
      // do nothing
      break;
    default:
      page = '404';
      import(`${PRESENTATIONAL_COMPONENTS_PATH}/u-404.js`);
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