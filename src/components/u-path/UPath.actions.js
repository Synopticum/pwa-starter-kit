import {ENV} from "../../../environments/environments";
import {getApiHeaders} from "../../../environments/api";
import {MapConstants} from "../u-map/UMap.actions";
import isEmpty from "lodash-es/isEmpty";

export const PathConstants = {
    FETCH: 'PATH_FETCH',
    PUT: 'PATH_PUT',
    DELETE: 'PATH_DELETE',
    CLEAR_STATE: 'PATH_CLEAR_STATE',
    ADD_IMAGE: 'PATH_ADD_IMAGE',
    DELETE_IMAGE: 'PATH_DELETE_IMAGE',
    SET_ACTIVE_IMAGE: 'PATH_SET_ACTIVE_IMAGE'
};

// -------
export const fetchPath = (pathId) => async (dispatch) => {
    dispatch({
        type: PathConstants.FETCH,
        async: true,
        httpMethodToInvoke: _fetchPath,
        params: [pathId, dispatch]
    });
};

const _fetchPath = async (pathId, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/paths/${pathId.split('-')[0]}`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error('Error while fetching an path');
    }

    let path = await response.json();
    history.pushState(null, null, `${ENV[window.ENV].static}/paths/${path.id.split('-')[0]}`);

    if (!isEmpty(path.images)) {
        let activeYear = Math.min(...Path.keys(path.images)).toString();
        let activeImage = path.images[activeYear];

        dispatch(setActivePathImage(activeYear, activeImage));
    }

    return path;
};

// -------
export const deletePath = (pathId) => async (dispatch) => {
    dispatch({
        type: PathConstants.DELETE,
        async: true,
        httpMethodToInvoke: _deletePath,
        params: [pathId]
    });
};

const _deletePath = async (pathId) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/paths/${pathId}`, {
        method: 'DELETE',
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        throw new Error('Error while deleting an path');
    }

    return pathId;
};

// -------
export const putPath = (path) => async (dispatch) => {
    dispatch({
        type: PathConstants.PUT,
        async: true,
        httpMethodToInvoke: _putPath,
        params: [path, dispatch]
    });
};

const _putPath = async (pathToPut, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/paths/${pathToPut.id}`, {
        method: 'PUT',
        headers: getApiHeaders(localStorage.token),
        body: JSON.stringify(pathToPut)
    });

    if (!response.ok) {
        dispatch({ type: MapConstants.PATHS.THROW_ERROR, payload: pathToPut });
        throw new Error('Error while putting an abject');
    }

    let path = await response.json();

    dispatch({ type: MapConstants.PATHS.UPDATE, payload: path });

    return path;
};

// -------
export const addPathImage = (year, key) => (dispatch, getState) => {
    dispatch({
        type: PathConstants.ADD_IMAGE,
        payload: { year, key }
    });
};

export const deletePathImage = (year) => (dispatch, getState) => {
    dispatch({
        type: PathConstants.DELETE_IMAGE,
        payload: { year }
    });
};

export const setActivePathImage = (year, image) => (dispatch, getState) => {
    dispatch({
        type: PathConstants.SET_ACTIVE_IMAGE,
        payload: { image, year }
    });
};

export const clearPathState = () => (dispatch, getState) => {
    dispatch({ type: PathConstants.CLEAR_STATE });
};