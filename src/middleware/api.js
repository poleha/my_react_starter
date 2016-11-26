import "isomorphic-fetch";
import {normalize, arrayOf} from "normalizr";
import {eraseCookie} from "../helpers/helper";
import {LOGOUT_USER_SUCCESS} from "../constants/Auth";

export const API_KEY = Symbol('Api');

function fetchApi(endpoint, method, headers, body, schema) {
    let options = {method, headers};
    if (['get', 'head'].indexOf(method) < 0) {
        options.body = JSON.stringify(body);
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

    }
    //headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS, PUT';
    return fetch(endpoint, options).then(response => response.json().then((json) => {
        if (response.ok) {
            if (schema) {
                if (json.results) {
                    return Object.assign(json, normalize(json.results, arrayOf(schema)));
                }
                else {
                    return normalize(json, schema);
                }
            }
            else return json;
        }

        else {
            json.status = response.status;
            return Promise.reject(json);


        }
    })).catch(error => {
        if (error.__proto__.constructor === SyntaxError) return null;
        else return Promise.reject(error)
    })
}


function createAction(action, actionType) {
    return Object.assign({}, action, {type: actionType});
}
export function createApiMiddelware(req) {

    return store => dispatch => action => {
        if (action[API_KEY]) {
            const state = store.getState();
            let apiAction = action[API_KEY];
            let [actionStart, actionSuccess, actionFail] = apiAction.actions;
            let endpoint = apiAction.endpoint;
            let method = apiAction.method;
            let schema = apiAction.schema || null;
            let body = apiAction.body;
            let token = apiAction.token || state.auth.token;
            let headers = {};
            if (token) {
                headers.Authorization = `Token ${token}`;
            }
            delete action[API_KEY];
            actionStart = createAction(action, actionStart);
            actionSuccess = createAction(action, actionSuccess);
            actionFail = createAction(action, actionFail);

            let promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(dispatch(actionStart));
                }, 0)
            });
            return promise.then(() => {
                return fetchApi(endpoint, method, headers, body, schema)
            }).then(response => {
                    actionSuccess.payload = response;
                    dispatch(actionSuccess);
                    return Promise.resolve(response);
                }
            ).catch(error => {
                actionFail.payload = error;
                if (error.status == 401) {
                    eraseCookie('test_app_token');
                    dispatch({type: LOGOUT_USER_SUCCESS})
                }
                dispatch(actionFail);
                return Promise.reject(error);
            })
        }
        else return dispatch(action);
    };
}
