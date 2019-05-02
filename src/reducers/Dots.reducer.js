import { MAP } from "../components/u-map/UMap.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName,
} from "../middleware/asyncActionsMiddleware";

export const dots = (state = {
    items: [],
    isFetching: false
}, action) => {
    switch (action.type) {
        case generateInProgressActionTypeName(MAP.DOTS.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(MAP.DOTS.FETCH):
            return {
                ...state,
                isFetching: false,
                items: action.payload
            };

        case generateErrorActionTypeName(MAP.DOTS.FETCH):
            return {
                ...state,
                isFetching: false
            };

        case MAP.DOTS.UPDATE:
            return {
                ...state,
                items: [...state.items, action.payload]
            };

        default:
            return state;
    }
};
