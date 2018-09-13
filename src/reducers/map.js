import {
  SHOW_OBJECT_TOOLTIP,
  HIDE_OBJECT_TOOLTIP } from '../actions/map';

const map = (state = {
  activeObject: {},
  tooltipPosition: {},
  isTooltipVisible: false
}, action) => {
  switch (action.type) {
    case SHOW_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: true,
        activeObject: action.payload.activeObject,
        tooltipPosition: action.payload.tooltipPosition
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
