import React, {PropTypes} from "react";
import BaseComponent from "../../components/BaseComponent";
import {formArrayToJson} from "../../helpers/helper";
import FacebookLogin from "../../components/FacebookLogin";
import classNames from "classnames";
import * as authActions from "../../actions/AuthActions";
import {connect} from "react-redux";
import {asyncConnect} from "redux-async-connect";
import {bindActionCreators} from "redux";

function mapStateToProps(state) {
    return {
        logged: state.auth.logged,
        token: state.auth.token,
        userId: state.auth.userId,
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        authActions: bindActionCreators(authActions, dispatch)
    };
}

@asyncConnect([{
    promise: (params, helpers) => {
        let store = params.store;
        let loginPromise;
        if (global.loginPromise) {
            loginPromise = global.loginPromise;
        }
        else {
            loginPromise = Promise.resolve();
        }

        let promises = []


        promises.push(loginPromise);

        return Promise.all(promises);
    }
}])
@connect(mapStateToProps, mapDispatchToProps)
export default class Registration extends BaseComponent {
    registrationFormSubmit(e) {
        e.preventDefault();
        let registerForm = $(this._register_form);
        this.props.authActions.registerUser(formArrayToJson(registerForm.serializeArray()));
    }

    getRegisterBlockTemplate() {
        let registerBlockTemplate = null;
        if (!this.props.userId) {
            let non_field_errors = this.getFieldErrors('non_field_errors', 'auth', 'registerErrors')
            let email_errors = this.getFieldErrors('email', 'auth', 'registerErrors')
            let username_errors = this.getFieldErrors('username', 'auth', 'registerErrors')
            let password_errors = this.getFieldErrors('password', 'auth', 'registerErrors')
            let retype_password_errors = this.getFieldErrors('retype_password', 'auth', 'registerErrors')

            registerBlockTemplate = (
                <div className='registration_block'>
                    <form
                        className='registration_form'
                        onSubmit={this.registrationFormSubmit.bind(this)}
                        ref={(c) => this._register_form = c}
                    >
                        {non_field_errors}
                        <div className={classNames('form_field', {has_errors: email_errors})}>
                            {email_errors}
                            <input
                                autoComplete="off"
                                type='text'
                                ref={(c) => this._email = c}
                                className='user_email'
                                id='user_email'
                                name='email'
                                placeholder='E-mail'
                                required
                            />
                        </div>
                        <div className={classNames('form_field', {has_errors: username_errors})}>
                            {username_errors}
                            <input
                                autoComplete="off"
                                type='text'
                                ref={(c) => this._username = c}
                                className='user_username'
                                id='user_username'
                                name='username'
                                placeholder='Username'
                                required
                            />
                        </div>

                        <div className={classNames('form_field', {has_errors: password_errors})}>
                            {password_errors}
                            <input
                                autoComplete="off"
                                type='text'
                                ref={(c) => this._password = c}
                                className='user_password'
                                id='user_password'
                                name='password'
                                type='password'
                                placeholder='Password'
                                required
                            />
                        </div>
                        <div className={classNames('form_field', {has_errors: retype_password_errors})}>
                            {retype_password_errors}
                            <input
                                autoComplete="off"
                                type='text'
                                ref={(c) => this._password2 = c}
                                className='retype_password'
                                id='retype_password'
                                name='retype_password'
                                type='password'
                                placeholder='Retype password'
                                required
                            />
                        </div>
                        <input
                            type='submit'
                            className='user_submit btn btn-default'
                            value='Register'
                        />
                    </form>
                </div>
            )
        }

        return registerBlockTemplate
    }

    getSocialLoginTemplate() {
        let socialLoginTemplate = null;
        if (!this.props.data.userId) {
            socialLoginTemplate = (
                <div className={classNames('social', {hidden: this.props.data.userId})}>
                    <FacebookLogin
                        actions={this.props.actions}
                    />
                </div>
            )
        }
        return socialLoginTemplate;
    }

    render() {
        return (
            <div>
                {this.getRegisterBlockTemplate()}
            </div>
        )
    }
}

