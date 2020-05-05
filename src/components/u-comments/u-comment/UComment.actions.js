import {ENV} from '../../../../environments/environments';
import {getApiHeaders} from '../../../../environments/api';
import {store} from "../../../store";
import {updateAvatarsCache} from "../../u-app/UApp.actions";

export const UCommentActions = {
    FETCH: 'COMMENT_AVATAR_FETCH'
};

// -------
export const fetchAvatar = (authorId) => async (dispatch, getState) => {
    dispatch({
        type: UCommentActions.FETCH,
        async: true,
        httpMethodToInvoke: _fetchAvatar,
        params: [authorId, dispatch, getState]
    });
};

const _fetchAvatar = async (authorId, dispatch, getState) => {
    const state = getState();
    const avatarsCache = state.app.user.avatarsCache;
    let avatarUrl;

    if (!avatarsCache[authorId]) {
        let response = await fetch(`${ENV[window.ENV].api}/api/users/${authorId}/avatar`, {
            method: 'GET',
            headers: getApiHeaders(localStorage.token)
        });

        if (!response.ok) {
            throw new Error('Error while fetching avatar');
        }

        avatarUrl = await response.json();
        dispatch(updateAvatarsCache(authorId, avatarUrl));

        return avatarUrl;
    }

    return avatarsCache[authorId];
};
