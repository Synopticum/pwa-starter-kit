import {ENV} from "../../../environments/environments";
import {getApiHeaders} from "../../../environments/api";
import {MapConstants} from "../u-map/UMap.actions";

export const PathConstants = {
    FETCH: 'PATH_FETCH',
    PUT: 'PATH_PUT',
    DELETE: 'PATH_DELETE',
    CLEAR_STATE: 'PATH_CLEAR_STATE'
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
    let response = await fetch(`${ENV[window.ENV].api}/api/objects/${pathId.split('-')[0]}`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error('Error while fetching a path');
    }

    let path = await response.json();
    history.pushState(null, null, `${ENV[window.ENV].static}/objects/${path.id.split('-')[0]}`);

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
    let response = await fetch(`${ENV[window.ENV].api}/api/objects/${pathId}`, {
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
        dispatch({ type: MapConstants.OBJECTS.THROW_ERROR, payload: pathToPut });
        throw new Error('Error while putting an path');
    }

    let path = await response.json();

    dispatch({ type: MapConstants.OBJECTS.UPDATE, payload: path });

    return path;
};

export const clearPathState = () => (dispatch, getState) => {
    dispatch({ type: PathConstants.CLEAR_STATE });
};