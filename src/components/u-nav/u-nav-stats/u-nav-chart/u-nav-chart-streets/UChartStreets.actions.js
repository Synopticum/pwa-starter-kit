import {ENV} from '../../../../../../environments/environments';
import {getApiHeaders} from '../../../../../../environments/api';

export const UChartStreets = {
    FETCH: 'CHART_STREETS_FETCH'
};

// -------
export const fetchData = () => async (dispatch) => {
    dispatch({
        type: UChartStreets.FETCH,
        async: true,
        httpMethodToInvoke: _fetchData,
        params: []
    });
};

const _fetchData = async () => {
    let response = await fetch(`${ENV[window.ENV].api}/api/stats/addresses`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error('Error while fetching');
    }

    return await response.json();
};
