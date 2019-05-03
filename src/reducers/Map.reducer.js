import {MapConstants} from "../components/u-map/UMap.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName,
} from "../middleware/asyncActionsMiddleware";

export const map = (state = {
    tooltip: {
        isVisible: false,
        isFetching: false,
        item: {},
        position: {},
    },

    contextMenu: {
        isVisible: false,
        position: {}
    },

    dotCreator: {
        isVisible: false,
        position: {}
    },

    clouds: {
        visibility: 'none'
    },

    dotPage: { currentDotId: '', isVisible: false },
}, action) => {
    switch (action.type) {
        case generateInProgressActionTypeName(MapConstants.TOOLTIP.FETCH):
            return {
                ...state,
                tooltip: {
                    ...state.tooltip,
                    isFetching: true

                }
            };

        case generateSuccessActionTypeName(MapConstants.TOOLTIP.FETCH):
            return {
                ...state,
                tooltip: {
                    ...state.tooltip,
                    isFetching: false,
                    item: action.payload.item,
                    position: action.payload.position
                }
            };

        case generateErrorActionTypeName(MapConstants.TOOLTIP.FETCH):
            return {
                ...state,
                tooltip: {
                    ...state.tooltip,
                    isFetching: false
                }
            };

        case MapConstants.TOGGLE.TOOLTIP:
            return {
                ...state,
                tooltip: {
                    ...state.tooltip,
                    isVisible: action.payload
                }
            };

        case MapConstants.TOGGLE.CONTEXT_MENU:
            return {
                ...state,
                contextMenu: {
                    ...state.contextMenu,
                    isVisible: action.payload.isVisible,
                    position: action.payload.position
                }
            };

        case MapConstants.TOGGLE.DOT_CREATOR:
            return {
                ...state,
                dotCreator: {
                    ...state.dotCreator,
                    isVisible: action.payload.isVisible,
                    position: action.payload.position
                }
            };

        case MapConstants.TOGGLE.CLOUDS:
            return {
                ...state,
                clouds: {
                    ...state.clouds,
                    visibility: action.payload.visibility
                }
            };

        case MapConstants.DOT_PAGE.SET_ID:
            return {
                ...state,
                dotPage: {
                    isVisible: Boolean(action.payload),
                    currentDotId: action.payload
                }
            };

        default:
            return state;
    }
};