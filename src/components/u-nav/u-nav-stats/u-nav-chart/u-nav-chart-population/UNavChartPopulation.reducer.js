import {UNavChartPopulation} from "./UNavChartPopulation.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../../../middleware/asyncActionsMiddleware";

export const chartPopulation = (state = [], action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UNavChartPopulation.FETCH):
            return state;

        case generateSuccessActionTypeName(UNavChartPopulation.FETCH):
            return action.payload;

        case generateErrorActionTypeName(UNavChartPopulation.FETCH):
            return state;

        default:
            return state;
    }
};