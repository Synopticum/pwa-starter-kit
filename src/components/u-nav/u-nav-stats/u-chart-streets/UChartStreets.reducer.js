import {UChartStreets} from "./UChartStreets.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../../middleware/asyncActionsMiddleware";

export const chartStreets = (state = [], action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UChartStreets.FETCH):
            return state;

        case generateSuccessActionTypeName(UChartStreets.FETCH):
            return action.payload;

        case generateErrorActionTypeName(UChartStreets.FETCH):
            return state;

        default:
            return state;
    }
};