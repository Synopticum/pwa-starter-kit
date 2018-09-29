//
// Action
//
const CREATE_DOT = {
  UPDATE_FORM: 'CREATE_DOT__UPDATE_FORM'
};

export const updateForm = (state) => (dispatch, getState) => {
  dispatch({
    type: CREATE_DOT.UPDATE_FORM,
    payload: state
  });
};

//
// Reducer
//
export const createDot = (state = { title: '', layer: '', type: 'global' }, action) => {
  switch (action.type) {
    case CREATE_DOT.UPDATE_FORM:
      return Object.assign(state, action.payload);

    default:
      return state;
  }
};
