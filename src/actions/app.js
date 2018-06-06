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

export const navigate = (path) => (dispatch) => {
    // Extract the page name from path.
    const page = path === '/' ? '/' : path.slice(1);

    // Any other info you might want to extract from the path (like page type),
    // you can do here
    dispatch(loadPage(page));
};

const loadPage = (page) => async (dispatch) => {
    if ([
      '/',
      'success',
      'U★R★U★S★S★I★N★K★A',
      'C★H★E★K★A★V★O',
      'Z★A★P★I★L★I',
      'C★H★O★M★U',
      'C★H★O★P★O★C★H★O★M',
      'P★O★E★D★U',
      'U★D★O★L★I'
    ].indexOf(page) === -1) {
      page = '404';
    }

    dispatch(updatePage(page));

    switch (page) {
        case '/':
            import('../components/app-level/u-map/u-map.js');
            import('../components/app-level/u-object-tooltip/u-object-tooltip.js');
            import('../components/app-level/u-object-info/u-object-info.js');
            import('../components/app-level/u-object-editor/u-object-editor.js');
            // Put code here that you want it to run every time when
            // navigate to / and u-map.js is loaded
            break;
        case 'success':
          // do nothing
          break;
        case 'U★R★U★S★S★I★N★K★A':
            import('../components/app-level/u-map/u-map.js');
            import('../components/app-level/u-news/u-news.js');
            break;
        case 'C★H★E★K★A★V★O':
            import('../components/app-level/u-map/u-map.js');
            import('../components/app-level/u-ads/u-ads.js');
            break;
        case 'Z★A★P★I★L★I':
            import('../components/app-level/u-map/u-map.js');
            import('../components/app-level/u-ideas/u-ideas.js');
            break;
        case 'C★H★O★M★U':
            import('../components/app-level/u-map/u-map.js');
            import('../components/app-level/u-claims/u-claims.js');
            break;
        case 'C★H★O★P★O★C★H★O★M':
            import('../components/app-level/u-map/u-map.js');
            import('../components/app-level/u-sale/u-sale.js');
            break;
        case 'P★O★E★D★U':
            import('../components/app-level/u-map/u-map.js');
            import('../components/app-level/u-rides/u-rides.js');
            break;
        case 'U★D★O★L★I':
            import('../components/app-level/u-map/u-map.js');
            import('../components/app-level/u-anonymous/u-anonymous.js');
            break;
        default:
            import('../components/reusable/u-404.js');
    }
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
