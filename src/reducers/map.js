import {
  GET_OBJECT_TOOLTIP_FAILURE,
  GET_OBJECT_TOOLTIP_REQUEST,
  GET_OBJECT_TOOLTIP_SUCCESS,
  HIDE_OBJECT_TOOLTIP } from '../actions/map';

const map = (state = {
  activeObject: {},
  tooltipPosition: {},
  isTooltipVisible: false
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

    default:
      return state;
  }
};

export default map;
