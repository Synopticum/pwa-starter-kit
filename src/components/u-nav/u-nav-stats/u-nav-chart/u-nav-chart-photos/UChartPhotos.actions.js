import {ENV} from '../../../../../../environments/environments';
import {getApiHeaders} from '../../../../../../environments/api';

export const UChartPhotos = {
    FETCH: 'CHART_PHOTOS_FETCH',
    UPDATE: 'CHART_PHOTOS_FETCH_UPDATE'
};

// -------
export const fetchAddresses = () => async (dispatch) => {
    dispatch({
        type: UChartPhotos.FETCH,
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
        type: UChartPhotos.TOGGLE,
        payload: value
    }
};
