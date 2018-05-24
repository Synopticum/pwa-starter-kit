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
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (path) => (dispatch) => {
    // Extract the page name from path.
    const page = path === '/' ? 'login' : path.slice(1);

    // Any other info you might want to extract from the path (like page type),
    // you can do here
    dispatch(loadPage(page));

    // Close the drawer - in case the *path* change came from a link in the drawer.
    dispatch(updateDrawerState(false));
};

const loadPage = (page) => async (dispatch) => {
    if ([
      'login',
      '★',
      'U★R★U★S★S★I★N★K★A',
      'C★H★E★K★A★V★O',
      'O★T★O★K★U★J',
      'C★H★O★M★U',
      'C★H★O★P★O★C★H★O★M',
      'P★O★E★D★U',
      'U★D★O★L★I'
    ].indexOf(page) === -1) {
      page = 'view404';
    }

    dispatch(updatePage(page));

    switch (page) {
        case 'login':
            await import('../components/app-level/u-login/u-login.js');
            break;
        case '★':
            await import('../components/app-level/u-map/u-map.js');
            // Put code here that you want it to run every time when
            // navigate to ★ and u-map.js is loaded
            break;
        case 'U★R★U★S★S★I★N★K★A':
            await import('../components/app-level/u-map/u-map.js');
            await import('../components/app-level/u-urussinka/u-urussinka.js');
            break;
        case 'C★H★E★K★A★V★O':
            await import('../components/app-level/u-map/u-map.js');
            await import('../components/app-level/u-chekavo/u-chekavo.js');
            break;
        case 'O★T★O★K★U★J':
            await import('../components/app-level/u-map/u-map.js');
            await import('../components/app-level/u-otakuj/u-otakuj.js');
            break;
        case 'C★H★O★M★U':
            await import('../components/app-level/u-map/u-map.js');
            await import('../components/app-level/u-chomu/u-chomu.js');
            break;
        case 'C★H★O★P★O★C★H★O★M':
            await import('../components/app-level/u-map/u-map.js');
            await import('../components/app-level/u-chopochom/u-chopochom.js');
            break;
        case 'P★O★E★D★U':
            await import('../components/app-level/u-map/u-map.js');
            await import('../components/app-level/u-poedu/u-poedu.js');
            break;
        case 'U★D★O★L★I':
            await import('../components/app-level/u-map/u-map.js');
            await import('../components/app-level/u-udoli/u-udoli.js');
            break;
        default:
            await import('../components/reusable/my-view404.js');
    }

    dispatch(updatePage(page));
};

const updatePage = (page) => {
    return {
        type: UPDATE_PAGE,
        page
    };
};

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
    dispatch({
        type: OPEN_SNACKBAR
    });
    clearTimeout(snackbarTimer);
    snackbarTimer = setTimeout(() =>
        dispatch({type: CLOSE_SNACKBAR}), 3000);
};

export const updateLayout = (wide) => (dispatch, getState) => {
    if (getState().app.drawerOpened) {
        dispatch(updateDrawerState(false));
    }
};

export const updateDrawerState = (opened) => (dispatch, getState) => {
    if (getState().app.drawerOpened !== opened) {
        dispatch({
            type: UPDATE_DRAWER_STATE,
            opened
        });
    }
};
