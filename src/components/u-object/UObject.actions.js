import {ENV} from "../../../environments/environments";
import {getApiHeaders} from "../../../environments/api";
import {MapConstants} from "../u-map/UMap.actions";

export const ObjectConstants = {
    FETCH: 'OBJECT_FETCH',
    PUT: 'OBJECT_PUT',
    DELETE: 'OBJECT_DELETE',
    CLEAR_STATE: 'OBJECT_CLEAR_STATE'
};

// -------
export const fetchObject = (objectId) => async (dispatch) => {
    dispatch({
        type: ObjectConstants.FETCH,
        async: true,
        httpMethodToInvoke: _fetchObject,
        params: [objectId, dispatch]
    });
};

const _fetchObject = async (objectId, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/objects/${objectId}`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error('Error while fetching an object');
    }

    let object = await response.json();
    history.pushState(null, null, `${ENV[window.ENV].static}/objects/${object.id}`);

    return object;
};

// -------
export const deleteObject = (objectId) => async (dispatch) => {
    dispatch({
        type: ObjectConstants.DELETE,
        async: true,
        httpMethodToInvoke: _deleteObject,
        params: [objectId]
    });
};

const _deleteObject = async (objectId) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/objects/${objectId}`, {
        method: 'DELETE',
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        throw new Error('Error while deleting an object');
    }

    return objectId;
};

// -------
export const putObject = (object) => async (dispatch) => {
    dispatch({
        type: ObjectConstants.PUT,
        async: true,
        httpMethodToInvoke: _putObject,
        params: [object, dispatch]
    });
};

const _putObject = async (objectToPut, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/objects/${objectToPut.id}`, {
        method: 'PUT',
        headers: getApiHeaders(localStorage.token),
        body: JSON.stringify(objectToPut)
    });

    if (!response.ok) {
        dispatch({ type: MapConstants.OBJECTS.THROW_ERROR, payload: objectToPut });
        throw new Error('Error while putting an abject');
    }

    let object = await response.json();

    dispatch({ type: MapConstants.OBJECTS.UPDATE, payload: object });

    return object;
};

export const clearObjectState = () => (dispatch, getState) => {
    dispatch({ type: ObjectConstants.CLEAR_STATE });
};