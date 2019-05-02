import {DOTS} from "../components/u-dot/redux";

export const dots = (state = {
    items: [],
    isFetching: false
}, action) => {
    switch (action.type) {
        case DOTS.GET.REQUEST:
            return {
                ...state,
                isFetching: true
            };

        case DOTS.GET.SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.payload
            };

        case DOTS.GET.FAILURE:
            return {
                ...state,
                isFetching: false
            };

        case DOTS.UPDATE:
            return {
                ...state,
                items: [...state.items, action.payload]
            };

        default:
            return state;
    }
};
