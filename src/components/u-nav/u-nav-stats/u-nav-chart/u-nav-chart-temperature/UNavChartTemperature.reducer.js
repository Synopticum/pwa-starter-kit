import {UNavChartTemperature} from "./UNavChartTemperature.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../../../middleware/asyncActionsMiddleware";

export const chartTemperatureHottest = (state = [], action) => {
    switch (action.type) {
        case generateInProgressActionTypeName(UNavChartTemperature.FETCH):
            return state;

        case generateSuccessActionTypeName(UNavChartTemperature.FETCH):
            return action.payload;

        case generateErrorActionTypeName(UNavChartTemperature.FETCH):
            return state;

        default:
            return state;
    }
};