import {ENV} from '../../../environments/environments';
import {getApiHeaders} from '../../../environments/api';

export const UPageConstants = {
    FETCH: 'PAGE_FETCH',
    UPDATE: 'PAGE_UPDATE',
    TOGGLE: 'PAGE_TOGGLE'
};

// -------
export const fetch = () => async (dispatch) => {
    dispatch({
        type: UPageConstants.FETCH,
        async: true,
        httpMethodToInvoke: _fetch,
        params: []
    });
};

const _fetch = async () => {
    let response = await fetch(`${ENV[window.ENV].api}/api/something`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error('Error while fetching something');
    }

    return await response.json();
};

// -------
export const toggle = (value) => {
    return {
        type: UPageConstants.TOGGLE,
        payload: value
    }
};
