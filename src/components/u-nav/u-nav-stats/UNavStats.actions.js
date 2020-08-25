import {ENV} from '../../../../environments/environments';
import {getApiHeaders} from '../../../../environments/api';

export const UNavStatsConstants = {
    TOGGLE: 'NAV_STATS_TOGGLE'
};

// -------
export const toggle = (value) => {
    return {
        type: UNavStatsConstants.TOGGLE,
        payload: value
    }
};
