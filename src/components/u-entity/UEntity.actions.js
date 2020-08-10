import {ENV} from "../../../environments/environments";
import {getApiHeaders} from "../../../environments/api";
import {MapConstants} from "../u-map/UMap.actions";
import isEmpty from "../../helpers/isEmpty";
import { getConstants } from './helpers';

// -------
export const fetchEntity = (type, id) => async (dispatch) => {
    const Constants = getConstants(type);

    dispatch({
        type: Constants.FETCH,
        async: true,
        httpMethodToInvoke: _fetchEntity,
        params: [type, id, dispatch]
    });
};

const _fetchEntity = async (type, id, dispatch) => {
    const response = await fetch(`${ENV[window.ENV].api}/api/${type}s/${id.split('-')[0]}`, {
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        if (response.status === 401) location.reload();
        throw new Error(`Error while fetching ${type}`);
    }

    const entity = await response.json();
    history.pushState(null, null, `${ENV[window.ENV].static}/${type}s/${entity.id.split('-')[0]}`);

    if (entity.images && !isEmpty(entity.images)) {
        debugger;
        let activeYear = Math.min(...Object.keys(entity.images).filter(item => !item.includes('_'))).toString();
        let activeImage = entity.images[activeYear];

        dispatch(setActiveEntityImage(type, activeYear, activeImage));
    }

    return entity;
};

// -------
export const deleteEntity = (type, id) => async (dispatch) => {
    const Constants = getConstants(type);

    dispatch({
        type: Constants.DELETE,
        async: true,
        httpMethodToInvoke: _deleteEntity,
        params: [type, id]
    });
};

const _deleteEntity = async (type, id) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/${type}s/${id}`, {
        method: 'DELETE',
        headers: getApiHeaders(localStorage.token)
    });

    if (!response.ok) {
        throw new Error(`Error while deleting ${type}`);
    }

    return id;
};

// -------
export const putEntity = (type, entity) => async (dispatch) => {
    const Constants = getConstants(type);

    dispatch({
        type: Constants.PUT,
        async: true,
        httpMethodToInvoke: _putEntity,
        params: [type, entity, dispatch]
    });
};

const _putEntity = async (type, entity, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/${type}s/${entity.id}`, {
        method: 'PUT',
        headers: getApiHeaders(localStorage.token),
        body: JSON.stringify(entity)
    });

    if (!response.ok) {
        dispatch({ type: MapConstants.OBJECTS.THROW_ERROR, payload: entity });
        throw new Error(`Error while putting ${type}`);
    }

    const resultEntity = await response.json();
    dispatch({ type: MapConstants.OBJECTS.UPDATE, payload: resultEntity });

    return resultEntity;
};

// -------
export const addEntityImage = (type, year, key) => (dispatch, getState) => {
    const Constants = getConstants(type);

    dispatch({
        type: Constants.ADD_IMAGE,
        payload: { year, key }
    });
};

export const deleteEntityImage = (type, year) => (dispatch, getState) => {
    const Constants = getConstants(type);

    dispatch({
        type: Constants.DELETE_IMAGE,
        payload: { year }
    });
};

export const setActiveEntityImage = (type, year, image) => (dispatch, getState) => {
    const Constants = getConstants(type);

    dispatch({
        type: Constants.SET_ACTIVE_IMAGE,
        payload: { image, year }
    });
};

export const clearEntityState = (type) => (dispatch, getState) => {
    const Constants = getConstants(type);

    dispatch({ type: Constants.CLEAR_STATE });
};