import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { userReducer } from './user';

const rootReducer = combineReducers({
    user: userReducer
});

const composeEnhancers =
    typeof window === 'object' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        }) :
        compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export { rootReducer };
export type RootState = ReturnType<typeof rootReducer>;