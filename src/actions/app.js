/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export const UPDATE_PAGE = 'UPDATE_PAGE';
import { hideObjectInfo, hideObjectEditor, showObjectInfoById } from './map';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? '/' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));
};

const loadPage = (page) => async (dispatch, getState) => {
  await import('../components/app-level/u-map/u-map.js');

  switch (true) {
    case (page === '/'):
      import('../components/app-level/u-object-tooltip/u-object-tooltip.js');
      import('../components/app-level/u-object-info/u-object-info.js');
      break;
    case (/^(objects)\/(.+)/.test(page)):
      import('../components/app-level/u-object-tooltip/u-object-tooltip.js');
      import('../components/app-level/u-object-info/u-object-info.js');
      let objectId = page.split('/')[1];
      dispatch(showObjectInfoById(objectId));
      break;
    case (page === 'success'):
      // do nothing
      break;
    case (page === 'U★R★U★S★S★I★N★K★A'):
      import('../components/app-level/u-news/u-news.js');
      import('../components/app-level/u-news/u-news-header/u-news-header.js');
      import('../components/app-level/u-news/u-news-leftside/u-news-leftside.js');
      import('../components/app-level/u-news/u-news-rightside/u-news-rightside.js');
      import('../components/app-level/u-news/u-news-main/u-news-main.js');
      import('../components/app-level/u-news/u-news-item/u-news-item.js');
      break;
    case (page === 'C★H★E★K★A★V★O'):
      import('../components/app-level/u-ads/u-ads.js');
      break;
    case (page === 'Z★A★P★I★L★I'):
      import('../components/app-level/u-ideas/u-ideas.js');
      break;
    case (page === 'C★H★O★M★U'):
      import('../components/app-level/u-claims/u-claims.js');
      break;
    case (page === 'C★H★O★P★O★C★H★O★M'):
      import('../components/app-level/u-sale/u-sale.js');
      break;
    case (page === 'P★O★E★D★U'):
      import('../components/app-level/u-rides/u-rides.js');
      break;
    case (page === 'U★D★O★L★I'):
      import('../components/app-level/u-anonymous/u-anonymous.js');
      break;
    default:
      page = '404';
      import('../components/reusable/u-404.js');
  }

  if (getState().app.isInfoVisible) {
    dispatch(hideObjectInfo());
  }

  if (getState().app.isEditorVisible) {
    dispatch(hideObjectEditor());
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
    type: UPDATE_PAGE,
    page,
    pageTitle: pageTitles.get(page)
  };
};
