//
// Action
//
import { ENV } from '../../../constants';
import { setCurrentObjectId } from '../../../components/app-level/u-map/redux';
import { getDot } from '../../../components/app-level/u-dot/redux';

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
      dispatch(getDot(page.split('/')[1]));
      break;
    case (page === 'success'):
      // do nothing
      break;
    case (page === 'U★R★U★S★S★I★N★K★A'):
      import(`${CONTAINER_COMPONENTS_PATH}/u-news/u-news.js`);
      import(`${CONTAINER_COMPONENTS_PATH}/u-news/u-news-header/u-news-header.js`);
      import(`${CONTAINER_COMPONENTS_PATH}/u-news/u-news-leftside/u-news-leftside.js`);
      import(`${CONTAINER_COMPONENTS_PATH}/u-news/u-news-rightside/u-news-rightside.js`);
      import(`${CONTAINER_COMPONENTS_PATH}/u-news/u-news-main/u-news-main.js`);
      import(`${CONTAINER_COMPONENTS_PATH}/u-news/u-news-item/u-news-item.js`);
      break;
    case (page === 'C★H★E★K★A★V★O'):
      import(`${CONTAINER_COMPONENTS_PATH}/u-ads/u-ads.js`);
      break;
    case (page === 'Z★A★P★I★L★I'):
      import(`${CONTAINER_COMPONENTS_PATH}/u-ideas/u-ideas.js`);
      break;
    case (page === 'C★H★O★M★U'):
      import(`${CONTAINER_COMPONENTS_PATH}/u-claims/u-claims.js`);
      break;
    case (page === 'C★H★O★P★O★C★H★O★M'):
      import(`${CONTAINER_COMPONENTS_PATH}/u-sale/u-sale.js`);
      break;
    case (page === 'P★O★E★D★U'):
      import(`${CONTAINER_COMPONENTS_PATH}/u-rides/u-rides.js`);
      break;
    case (page === 'U★D★O★L★I'):
      import(`${CONTAINER_COMPONENTS_PATH}/u-anonymous/u-anonymous.js`);
      break;
    default:
      page = '404';
      import(`${PRESENTATIONAL_COMPONENTS_PATH}/u-404.js`);
  }

  dispatch(updatePage(page));
};

let pageTitles = new Map();
pageTitles.set('/', 'План');
pageTitles.set('U★R★U★S★S★I★N★K★A', 'Уруссинка');
pageTitles.set('C★H★E★K★A★V★O', 'Чёкаво');
pageTitles.set('Z★A★P★I★L★I', 'Запили');
pageTitles.set('C★H★O★M★U', 'Чому');
pageTitles.set('C★H★O★P★O★C★H★O★M', 'Чопочом');
pageTitles.set('P★O★E★D★U', 'Поеду');
pageTitles.set('U★D★O★L★I', 'Удоли');

const updatePage = (page) => {
  return {
    type: PAGE.UPDATE,
    payload: {
      page,
      pageTitle: pageTitles.get(page)
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
        page: action.payload.page,
        pageTitle: action.payload.pageTitle
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