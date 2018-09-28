import {
  GET_OBJECT_TOOLTIP_FAILURE,
  GET_OBJECT_TOOLTIP_REQUEST,
  GET_OBJECT_TOOLTIP_SUCCESS,
  HIDE_OBJECT_TOOLTIP,
  TOGGLE_CONTEXT_MENU,
  TOGGLE_DOT_CREATE
} from '../actions/map';

const map = (state = {
  activeObject: {},

  isTooltipVisible: false,
  tooltipPosition: {},

  isContextMenuVisible: false,
  contextMenuPosition: {},
  contextMenuItems: [],

  isDotCreateVisible: false,
  dotCreateCoordinates: {},
}, action) => {
  switch (action.type) {
    case GET_OBJECT_TOOLTIP_REQUEST:
      return {
        ...state,
        isTooltipFetching: true
      };

    case GET_OBJECT_TOOLTIP_SUCCESS:
      return {
        ...state,
        activeObject: action.payload.activeObject,
        tooltipPosition: action.payload.tooltipPosition,
        isTooltipVisible: true,
        isTooltipFetching: false
      };

    case GET_OBJECT_TOOLTIP_FAILURE:
      return {
        ...state,
        isTooltipFetching: false
      };

    case HIDE_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: false
      };

    case TOGGLE_CONTEXT_MENU:
      return {
        ...state,
        isContextMenuVisible: action.payload.isContextMenuVisible,
        contextMenuPosition: action.payload.contextMenuPosition
      };

    case TOGGLE_DOT_CREATE:
      return {
        ...state,
        isDotCreateVisible: action.payload.isDotCreateVisible,
        dotCreateCoordinates: action.payload.dotCreateCoordinates
      };

    default:
      return state;
  }
};

export default map;
