import {UChartPhotos} from "./UChartPhotos.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../../../middleware/asyncActionsMiddleware";

export const chartPhotos = (state = [], action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UChartPhotos.FETCH):
            return state;

        case generateSuccessActionTypeName(UChartPhotos.FETCH):
            return action.payload;

        case generateErrorActionTypeName(UChartPhotos.FETCH):
            return state;

        default:
            return state;
    }
};