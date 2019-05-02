const asyncActionsMiddleware = store => next => action => {
    const isActionAsync = action.hasOwnProperty('async');

    if (!isActionAsync) {
        return next(action);
    }

    const {httpMethodToInvoke, params, type} = action;
    const inProgressType = generateInProgressActionTypeName(type);

    Promise.resolve(1).then(() => store.dispatch({type: inProgressType}));

    httpMethodToInvoke(...params)
        .then(response => {
            const successType = generateSuccessActionTypeName(type);

            Promise.resolve(1).then(() => store.dispatch({
                type: successType,
                payload: response
            }));
        })
        .catch(err => {
            console.log(err);
            const errorType = generateErrorActionTypeName(type);
            Promise.resolve(1).then(() => store.dispatch({type: errorType, err}));
        });

    return next(action);
};

const generateInProgressActionTypeName = (basicActionName) => `${basicActionName}_IN_PROGRESS`;
const generateSuccessActionTypeName = (basicActionName) => `${basicActionName}_SUCCESS`;
const generateErrorActionTypeName = (basicActionName) => `${basicActionName}_ERROR`;

export {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    asyncActionsMiddleware
};