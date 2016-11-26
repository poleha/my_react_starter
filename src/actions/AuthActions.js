import {
    USER_LOGIN_START,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    GET_USER_INFO_START,
    GET_USER_INFO_SUCCESS,
    GET_USER_INFO_FAIL,
    LOGOUT_USER_SUCCESS,
    REGISTER_USER_START,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    USER_FACEBOOK_LOGIN_START,
    USER_FACEBOOK_LOGIN_SUCCESS,
    USER_FACEBOOK_LOGIN_FAIL,
    USER_SOCIAL_LOGIN_START,
    USER_SOCIAL_LOGIN_SUCCESS,
    USER_SOCIAL_LOGIN_FAIL
} from '../constants/Auth';
import {API_KEY} from '../middleware/api';
import {createCookie, eraseCookie, readCookie, apiHost} from '../helpers/helper';
import {browserHistory} from 'react-router';
import config from '../config';

const endpoint = apiHost;

export function loginUser(userData) {
    return function (dispatch, getState) {

        let action = {
            [API_KEY]: {
                method: 'post',
                endpoint: `${endpoint}/obtain_auth_token/`,
                actions: [USER_LOGIN_START, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL],
                body: userData
            }
        }

        dispatch(action).then((response) => {
            let days;
            if (userData.save_me) days = config.cookie.expireDays;
            else days = '';

            createCookie('test_app_token', response.token, days);
            return dispatch(getUserInfo());
        }).catch((error) => {
        });

    }

}


//*************************
export function getUserInfo() {
    return function (dispatch, getState, req) {


        let action = {
            [API_KEY]: {
                method: 'get',
                endpoint: `${endpoint}/get_user_info/`,
                actions: [GET_USER_INFO_START, GET_USER_INFO_SUCCESS, GET_USER_INFO_FAIL],
                token: readCookie('test_app_token', req)
            }
        }

        let loginPromise = dispatch(action).then((response) => {


        }).then(() => dispatch(loadCart()))
            .catch((error) => {
                eraseCookie('test_app_token', req);
                return error
            });
        global.loginPromise = loginPromise;
        return loginPromise;
    }
}

//*************************


export function logoutUser() {
    return function (dispatch, getState) {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                eraseCookie('test_app_token');
                resolve(dispatch({type: LOGOUT_USER_SUCCESS}));
            }, 0)
        });
        return promise
    };
}


//***************************************

//*************************************
export function registerUser(data) {
    let loginData = {
        username: data.username,
        password: data.password
    };

    return function (dispatch, getState) {
        let action = {
            [API_KEY]: {
                method: 'post',
                endpoint: `${endpoint}/registration/`,
                actions: [REGISTER_USER_START, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL],
                body: data
            }
        }

        dispatch(action).then(response => {
            dispatch(loginUser(loginData))
        }).then(() => browserHistory.push('/'))
            .catch((error) => {
            });

    }
}


export function FacebookLogin() {
    return function (dispatch, getState, req) {
        dispatch({type: USER_FACEBOOK_LOGIN_START});

        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me', function (response) {


                    FB.api('/me?fields=email', function (responseFromFB) {


                        let body = {
                            username: response.name,
                            user_id: response.id,
                            network: 'facebook',
                            email: responseFromFB.email
                        };

                        let action = {
                            [API_KEY]: {
                                method: 'post',
                                endpoint: `${endpoint}/social_login/`,
                                body: body,
                                actions: [USER_SOCIAL_LOGIN_START, USER_SOCIAL_LOGIN_SUCCESS, USER_SOCIAL_LOGIN_FAIL]
                            },
                            body: body
                        };

                        dispatch(action).then(response => {
                            createCookie('test_app_token', response.key, req);
                            dispatch(getUserInfo());
                        }).then(response => {
                            dispatch({
                                type: USER_FACEBOOK_LOGIN_SUCCESS
                            })

                        });


                    })


                });
            } else {
                dispatch({type: USER_FACEBOOK_LOGIN_FAIL});
            }
        }, {scope: 'email'});

    }
}
