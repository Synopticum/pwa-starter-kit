import {ENV} from '../../../../../../environments/environments';
import {getApiHeaders} from '../../../../../../environments/api';

export const UNavChartTemperature = {
    FETCH: 'CHART_PHOTOS_FETCH'
};

// -------
export const fetchData = () => async (dispatch) => {
    dispatch({
        type: UNavChartTemperature.FETCH,
        async: true,
        httpMethodToInvoke: _fetchData,
        params: []
    });
};

const _fetchData = async () => {
    let response = await fetch(`${ENV[window.ENV].api}/api/stats/weather/temperature/hottest`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error('Error while fetching');
    }

    return await response.json();
};
