import { CREATE_DOT } from '../actions/create-dot.js';

const createDot = (state = { title: '', layer: '', type: 'global' }, action) => {
  switch (action.type) {
    case CREATE_DOT.UPDATE_FORM:
      return Object.assign(state, action.payload);

    default:
      return state;
  }
};

export default createDot;