export const CREATE_DOT = {
  UPDATE_FORM: 'CREATE_DOT__UPDATE_FORM'
};

export const updateForm = (state) => (dispatch, getState) => {
  dispatch({
    type: CREATE_DOT.UPDATE_FORM,
    payload: state
  });
};