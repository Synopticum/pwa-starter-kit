import {UNavChartSummer} from "./UNavChartSummer.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../../../middleware/asyncActionsMiddleware";

export const chartSummer = (state = [], action) => {
    switch (action.type) {
        case generateInProgressActionTypeName(UNavChartSummer.FETCH):
            return state;

        case generateSuccessActionTypeName(UNavChartSummer.FETCH):
            return action.payload;

        case generateErrorActionTypeName(UNavChartSummer.FETCH):
            return state;

        default:
            return state;
    }
};