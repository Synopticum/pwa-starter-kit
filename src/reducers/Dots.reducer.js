import { MapConstants } from "../components/u-map/UMap.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName,
} from "../middleware/asyncActionsMiddleware";
import {DotConstants} from "../components/u-dot/UDot.actions";

export const dots = (state = {
    items: [],
    isFetching: false
}, action) => {
    switch (action.type) {
        case generateInProgressActionTypeName(MapConstants.DOTS.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(MapConstants.DOTS.FETCH):
            return {
                ...state,
                isFetching: false,
                items: action.payload
            };

        case generateErrorActionTypeName(MapConstants.DOTS.FETCH):
            return {
                ...state,
                isFetching: false
            };

        case MapConstants.DOTS.UPDATE:
            return {
                ...state,
                items: [...state.items, action.payload]
            };

        case DotConstants.DELETE:
            const dotId = action.params[0];

            return {
                ...state,
                items: state.items.filter(dot => dot.id !== dotId)
            };

        default:
            return state;
    }
};
