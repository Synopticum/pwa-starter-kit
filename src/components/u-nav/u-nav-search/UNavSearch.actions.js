import {ENV} from '../../../../environments/environments';
import {getApiHeaders} from '../../../../environments/api';

export const UNavSearchConstants = {
    SEARCH: 'NAV_SEARCH_SEARCH',
    UPDATE: 'NAV_SEARCH_UPDATE',
    CLEAR: 'NAV_SEARCH_CLEAR'
};

// -------
export const search = (value) => async (dispatch) => {
    dispatch({
        type: UNavSearchConstants.SEARCH,
        async: true,
        httpMethodToInvoke: _search,
        params: [value, dispatch]
    });
};

const _search = async (value, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/search?value=${value}`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error(`Error while search for ${value}`);
    }

    return await response.json();
};

// -------
export const clear = (value) => {
    return {
        type: UNavSearchConstants.CLEAR,
        payload: value
    }
};
