import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../middleware/asyncActionsMiddleware";
import {DotConstants} from "../components/u-dot/UDot.actions";

export const photoUpload = (state = {
    dot: {},
    isFetching: false,
    isUpdating: false,
    isLoadingError: false
}, action) => {
    switch (action.type) {
        default:
            return state;
    }
};