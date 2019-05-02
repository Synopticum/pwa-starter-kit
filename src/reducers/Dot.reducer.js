import {DOT} from "../components/u-dot/UDot.actions";

export const dotPage = (state = {
    dot: {},
    isFetching: false,
    isUpdating: false
}, action) => {
    switch (action.type) {
        // GET
        case DOT.GET.REQUEST:
            return {
                ...state,
                isFetching: true
            };

        case DOT.GET.SUCCESS:
            return {
                ...state,
                isFetching: false,
                dot: action.payload
            };

        case DOT.GET.FAILURE:
            return {
                ...state,
                isFetching: false
            };

        // CREATE/UPDATE
        case DOT.PUT.REQUEST:
            return {
                ...state,
                isUpdating: true,
                dotToBeUpdated: action.payload
            };

        case DOT.PUT.SUCCESS:
            return {
                ...state,
                isUpdating: false,
                dot: action.payload
            };

        case DOT.PUT.FAILURE:
            return {
                ...state,
                isUpdating: false
            };

        case DOT.CLEAR_STATE:
            return {
                dot: {},
                isFetching: false,
                isUpdating: false
            };

        default:
            return state;
    }
};