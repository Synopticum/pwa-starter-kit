import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {lazyReducerEnhancer} from 'pwa-helpers/lazy-reducer-enhancer.js';

import {app} from './reducers/App.reducer';
import {map} from './reducers/Map.reducer';
import {asyncActionsMiddleware} from "./middleware/asyncActionsMiddleware";

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created) and redux-thunk (so
// that you can dispatch async actions). See the "Redux and state management"
// section of the wiki for more details:
// https://github.com/Polymer/pwa-starter-kit/wiki/4.-Redux-and-state-management
export const store = createStore(
    (state, action) => state,
    composeEnhancers(
        lazyReducerEnhancer(combineReducers),
        applyMiddleware(asyncActionsMiddleware, thunk)
    )
);

// Initially loaded reducers.
store.addReducers({
    app,
    map
});
