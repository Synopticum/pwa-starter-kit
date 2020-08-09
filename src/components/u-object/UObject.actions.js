import {ENV} from "../../../environments/environments";
import {getApiHeaders} from "../../../environments/api";
import {MapConstants} from "../u-map/UMap.actions";
import isEmpty from "../../helpers/isEmpty";

export const ObjectConstants = {
    FETCH: 'OBJECT_FETCH',
    PUT: 'OBJECT_PUT',
    DELETE: 'OBJECT_DELETE',
    CLEAR_STATE: 'OBJECT_CLEAR_STATE',
    ADD_IMAGE: 'OBJECT_ADD_IMAGE',
    DELETE_IMAGE: 'OBJECT_DELETE_IMAGE',
    SET_ACTIVE_IMAGE: 'OBJECT_SET_ACTIVE_IMAGE'
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
    let response = await fetch(`${ENV[window.ENV].api}/api/objects/${objectId.split('-')[0]}`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error('Error while fetching an object');
    }

    let object = await response.json();
    history.pushState(null, null, `${ENV[window.ENV].static}/objects/${object.id.split('-')[0]}`);

    if (!isEmpty(object.images)) {
        let activeYear = Math.min(...Object.keys(object.images).filter(item => !item.includes('_'))).toString();
        let activeImage = object.images[activeYear];

        dispatch(setActiveObjectImage(activeYear, activeImage));
    }

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

// -------
export const addObjectImage = (year, key) => (dispatch, getState) => {
    dispatch({
        type: ObjectConstants.ADD_IMAGE,
        payload: { year, key }
    });
};

export const deleteObjectImage = (year) => (dispatch, getState) => {
    dispatch({
        type: ObjectConstants.DELETE_IMAGE,
        payload: { year }
    });
};

export const setActiveObjectImage = (year, image) => (dispatch, getState) => {
    dispatch({
        type: ObjectConstants.SET_ACTIVE_IMAGE,
        payload: { image, year }
    });
};

export const clearObjectState = () => (dispatch, getState) => {
    dispatch({ type: ObjectConstants.CLEAR_STATE });
};