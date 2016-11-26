import {createStore, applyMiddleware} from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import {createApiMiddelware} from "../middleware/api";


export default function configureStore(initialState, req) {

    const api = createApiMiddelware(req);
    const middleware = [thunk.withExtraArgument(req), api];
    if (__DEVELOPMENT__) {
        const createLogger = require('redux-logger');
        const logger = createLogger();
        middleware.push(logger);
    }
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middleware));


    if (module.hot) {
        module.hot.accept('../reducers', () => {  //module.hot.accept('../reducers', function () {
            const nextRootReducer = require('../reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}