import {MapConstants} from "./UMap.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
} from "../../middleware/asyncActionsMiddleware";
import {DotConstants} from "../u-dot/UDot.actions";
import {ObjectConstants} from "../u-object/UObject.actions";
import {PathConstants} from "../u-path/UPath.actions";

const tooltipDefaultPayload = {
    isVisible: false,
    isFetching: false,
    item: {},
    coordinates: { position: {}, origin: ''},
};

export const map = (state = {
    tooltip: tooltipDefaultPayload,

    contextMenu: {
        isVisible: false,
        position: {}
    },

    dotCreator: {
        isVisible: false,
        tempDot: null,
        position: {}
    },

    clouds: {
        visibility: 'none'
    },

    dotPage: {
        currentDotId: '',
        isVisible: false
    },

    objectPage: {
        currentObjectId: '',
        isVisible: false
    },

    pathPage: {
        currentPathId: '',
        isVisible: false
    },

    settings: {
        isDrawingObject: false
    }
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
                    coordinates: action.payload.coordinates
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
                tooltip: action.payload ? {
                    ...state.tooltip,
                    isVisible: action.payload
                } : tooltipDefaultPayload
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

        case MapConstants.OBJECT_PAGE.SET_ID:
            return {
                ...state,
                objectPage: {
                    isVisible: Boolean(action.payload),
                    currentObjectId: action.payload
                }
            };

        case MapConstants.PATH_PAGE.SET_ID:
            return {
                ...state,
                pathPage: {
                    isVisible: Boolean(action.payload),
                    currentPathId: action.payload
                }
            };

        case DotConstants.PUT:
            const [ dot ] = action.params;

            return {
                ...state,
                dotCreator: {
                    ...state.dotCreator,
                    tempDot: dot
                }
            };


        case generateSuccessActionTypeName(DotConstants.PUT):
        case generateErrorActionTypeName(DotConstants.PUT):
            return {
                ...state,
                dotCreator: {
                    ...state.dotCreator,
                    tempDot: null
                }
            };

        case MapConstants.SETTINGS.SET:
            let [name, value] =  Object.entries(action.payload)[0];

            return {
                ...state,
                settings: {
                    ...state.settings,
                    [name]: value
                }
            };

        default:
            return state;
    }
};

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
            const updatedItems = state.items.filter(item => item.id !== action.payload.id);
            return {
                ...state,
                items: [...updatedItems, action.payload]
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

export const objects = (state = {
    items: [],
    isFetching: false,
    failedObject: null
}, action) => {
    switch (action.type) {
        case generateInProgressActionTypeName(MapConstants.OBJECTS.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(MapConstants.OBJECTS.FETCH):
            return {
                ...state,
                isFetching: false,
                items: action.payload
            };

        case generateErrorActionTypeName(MapConstants.OBJECTS.FETCH):
            return {
                ...state,
                isFetching: false
            };

        case MapConstants.OBJECTS.UPDATE:
            return {
                ...state,
                items: [...state.items, action.payload]
            };

        case ObjectConstants.DELETE:
            const objectId = action.params[0];

            return {
                ...state,
                items: state.items.filter(object => object.id !== objectId)
            };

        case MapConstants.OBJECTS.THROW_ERROR:
            return {
                ...state,
                failedObject: action.payload
            };

        default:
            return state;
    }
};

export const paths = (state = {
    items: [],
    isFetching: false,
    failedPath: null
}, action) => {
    switch (action.type) {
        case generateInProgressActionTypeName(MapConstants.PATHS.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(MapConstants.PATHS.FETCH):
            return {
                ...state,
                isFetching: false,
                items: action.payload
            };

        case generateErrorActionTypeName(MapConstants.PATHS.FETCH):
            return {
                ...state,
                isFetching: false
            };

        case MapConstants.PATHS.UPDATE:
            return {
                ...state,
                items: [...state.items, action.payload]
            };

        case PathConstants.DELETE:
            const pathId = action.params[0];

            return {
                ...state,
                items: state.items.filter(path => path.id !== pathId)
            };

        case MapConstants.PATHS.THROW_ERROR:
            return {
                ...state,
                failedPath: action.payload
            };

        default:
            return state;
    }
};