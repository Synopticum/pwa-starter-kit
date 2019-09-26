import {ENV} from "../../../environments/environments";
import {getApiHeaders} from "../../../environments/api";
import {MapConstants} from "../u-map/UMap.actions";

export const ObjectConstants = {
    FETCH: 'OBJECT_FETCH',
    PUT: 'OBJECT_PUT',
    DELETE: 'OBJECT_DELETE',
    // CLEAR_STATE: 'OBJECT_CLEAR_STATE',
    // ADD_IMAGE: 'OBJECT_ADD_IMAGE',
    // DELETE_IMAGE: 'OBJECT_DELETE_IMAGE',
    // SET_ACTIVE_IMAGE: 'OBJECT_SET_ACTIVE_IMAGE'
};

export const putObject = (objectToPut) => async (dispatch) => {
    dispatch({
        type: ObjectConstants.PUT,
        async: true,
        httpMethodToInvoke: _putObject,
        params: [objectToPut, dispatch]
    });
};

const _putObject = async (objectToPut, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/objects/${objectToPut.id}`, {
        method: 'PUT',
        headers: getApiHeaders(localStorage.token),
        body: JSON.stringify(objectToPut)
    });

    if (!response.ok) {
        throw new Error('Error while putting an object');
    }

    let object = await response.json();

    // dispatch({ type: MapConstants.DOTS.UPDATE, payload: dot });

    return object;
};