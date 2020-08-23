import {ENV} from '../../../../environments/environments';
import {getApiHeaders} from '../../../../environments/api';

export const UNavStatsConstants = {
    FETCH_ADDRESSES: 'NAV_STATS_ADDRESSES',
    UPDATE: 'NAV_STATS_UPDATE_ADDRESSES',
    TOGGLE: 'NAV_STATS_TOGGLE'
};

// -------
export const fetchAddresses = () => async (dispatch) => {
    dispatch({
        type: UNavStatsConstants.FETCH_ADDRESSES,
        async: true,
        httpMethodToInvoke: _fetchAddresses,
        params: []
    });
};

const _fetchAddresses = async () => {
    let response = await fetch(`${ENV[window.ENV].api}/api/stats/addresses`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error('Error while fetching addresses');
    }

    return await response.json();
};

// -------
export const toggle = (value) => {
    return {
        type: UNavStatsConstants.TOGGLE,
        payload: value
    }
};
