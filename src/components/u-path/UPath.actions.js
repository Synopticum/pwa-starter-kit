import {ENV} from "../../../environments/environments";
import {getApiHeaders} from "../../../environments/api";
import {MapConstants} from "../u-map/UMap.actions";

export const PathConstants = {
    FETCH: 'OBJECT_FETCH',
    PUT: 'OBJECT_PUT',
    DELETE: 'OBJECT_DELETE',
    CLEAR_STATE: 'OBJECT_CLEAR_STATE',
    // ADD_IMAGE: 'OBJECT_ADD_IMAGE',
    // DELETE_IMAGE: 'OBJECT_DELETE_IMAGE',
    // SET_ACTIVE_IMAGE: 'OBJECT_SET_ACTIVE_IMAGE'
};

export const putPath = (path) => async (dispatch) => {
    dispatch({
        type: PathConstants.PUT,
        async: true,
        httpMethodToInvoke: _putPath,
        params: [path, dispatch]
    });
};

const _putPath = async (pathToPut, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/objects/${pathToPut.id}`, {
        method: 'PUT',
        headers: getApiHeaders(localStorage.token),
        body: JSON.stringify(pathToPut)
    });

    if (!response.ok) {
        dispatch({ type: MapConstants.PATHS.THROW_ERROR, payload: pathToPut });
        throw new Error('Error while putting a path');
    }

    let path = await response.json();

    dispatch({ type: MapConstants.PATHS.UPDATE, payload: path });

    return path;
};