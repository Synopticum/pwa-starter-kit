import {TOGGLE, TOOLTIP} from "../components/u-map/UMap.actions";
import {DOT_PAGE} from "../components/u-map/UMap.actions";

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
        case TOOLTIP.GET.REQUEST:
            return {
                ...state,
                tooltip: {
                    ...state.tooltip,
                    isFetching: true

                }
            };

        case TOOLTIP.GET.SUCCESS:
            return {
                ...state,
                tooltip: {
                    ...state.tooltip,
                    isFetching: false,
                    item: action.payload.item,
                    position: action.payload.position
                }
            };

        case TOOLTIP.GET.FAILURE:
            return {
                ...state,
                tooltip: {
                    ...state.tooltip,
                    isFetching: false
                }
            };

        case TOGGLE.TOOLTIP:
            return {
                ...state,
                tooltip: {
                    ...state.tooltip,
                    isVisible: action.payload
                }
            };

        case TOGGLE.CONTEXT_MENU:
            return {
                ...state,
                contextMenu: {
                    ...state.contextMenu,
                    isVisible: action.payload.isVisible,
                    position: action.payload.position
                }
            };

        case TOGGLE.DOT_CREATOR:
            return {
                ...state,
                dotCreator: {
                    ...state.dotCreator,
                    isVisible: action.payload.isVisible,
                    position: action.payload.position
                }
            };

        case TOGGLE.CLOUDS:
            return {
                ...state,
                clouds: {
                    ...state.clouds,
                    visibility: action.payload.visibility
                }
            };

        case DOT_PAGE.SET_ID:
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