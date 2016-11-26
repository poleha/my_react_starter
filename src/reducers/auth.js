import {
    USER_LOGIN_START,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    GET_USER_INFO_START,
    GET_USER_INFO_SUCCESS,
    GET_USER_INFO_FAIL,
    LOGOUT_USER_START,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    REGISTER_USER_START,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    USER_SOCIAL_LOGIN_START,
    USER_SOCIAL_LOGIN_SUCCESS,
    USER_SOCIAL_LOGIN_FAIL,
    PASSWORD_RESET_START,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL
} from "../constants/Auth";
import update from "react-addons-update";

var newState;

const initialState = {
    logged: false,
    logging: false,
    socialLogging: false,
    userName: null,
    userId: null,
    token: null,
    loginErrors: {},
    registerErrors: {},
    network: null,
    externalId: null,
    email: null

};

function cloneState(state) {
    newState = update(state, {
        logging: {$set: false},
        loginErrors: {$set: {}},
        registerErrors: {$set: {}},

    });
    return newState;
}

export default function user(state = initialState, action) {

    switch (action.type) {
        case USER_LOGIN_START:
            state = cloneState(state);
            newState = update(state, {
                logging: {$set: true}
            });

            return newState;
        case USER_LOGIN_SUCCESS:
            state = cloneState(state);
            newState = update(state, {
                logging: {$set: false},
                token: {$set: action.payload.auth_token}
            });
            return newState;
        case USER_LOGIN_FAIL:
            state = cloneState(state);
            newState = update(state, {
                loginErrors: {$set: action.payload},
                logging: {$set: false},
                token: {$set: null}
            });
            return newState;

        case GET_USER_INFO_START:
            state = cloneState(state);
            newState = update(state, {
                logging: {$set: true}
            });

            return newState;
        case GET_USER_INFO_SUCCESS:
            state = cloneState(state);
            newState = update(state, {
                userName: {$set: action.payload.user.username},
                userId: {$set: action.payload.user.id},
                logged: {$set: true},
                logging: {$set: false},
                token: {$set: action.payload.token.key},
                email: {$set: action.payload.user.email},

            });

            return newState;

        case GET_USER_INFO_FAIL:
            state = cloneState(state);

            newState = update(state, {
                userName: {$set: null},
                userId: {$set: null},
                logged: {$set: true},
                logging: {$set: false}
            });

            return newState;

        case LOGOUT_USER_START:
            state = cloneState(state);
            newState = update(state, {
                logging: {$set: true}
            });
            return newState;
        case LOGOUT_USER_SUCCESS:
            state = cloneState(state);

            newState = update(state, {
                userName: {$set: null},
                userId: {$set: null},
                logging: {$set: false},
                token: {$set: null},
                receiveCommentsEmail: {$set: null}

            });
            return newState;

        case LOGOUT_USER_FAIL:
            newState = update(state, {
                logging: {$set: false}
            });
            return newState;


        case REGISTER_USER_START:
            state = cloneState(state);
            newState = update(state, {
                registerErrors: {$set: {}},
                logging: {$set: true}
            });

            return newState;
        case REGISTER_USER_SUCCESS:
            state = cloneState(state);
            newState = update(state, {
                registerErrors: {$set: {}},
                logging: {$set: false}
            });

            return newState;
        case REGISTER_USER_FAIL:
            state = cloneState(state);
            newState = update(state, {
                registerErrors: {$set: action.payload},
                logging: {$set: false}
            });

            return newState;

        case USER_SOCIAL_LOGIN_START:
            state = cloneState(state);
            return state;

        case USER_SOCIAL_LOGIN_SUCCESS:
            state = cloneState(state);
            newState = update(state, {
                externalId: {$set: action.body.user_id},
                network: {$set: action.body.network}
            });

            return newState;
        case USER_SOCIAL_LOGIN_FAIL:
            state = cloneState(state);
            newState = update(state, {
                externalId: {$set: null},
                network: {$set: null}
            });

            return newState;


        default:
            return state;
    }

}