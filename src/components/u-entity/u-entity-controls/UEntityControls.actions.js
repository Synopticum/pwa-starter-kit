import {ENV} from '../../../../environments/environments';
import {getApiHeaders} from '../../../../environments/api';
import {getConstants} from './helpers';

// -------
export const fetch = (type) => async (dispatch) => {
    const Constants = getConstants(type);

    dispatch({
        type: Constants.FETCH,
        async: true,
        httpMethodToInvoke: _fetch,
        params: [type]
    });
};

const _fetch = async (type) => {
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
export const toggle = (type, value) => {
    const Constants = getConstants(type);

    return {
        type: Constants.TOGGLE,
        payload: value
    }
};
