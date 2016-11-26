import React, {PropTypes} from "react";
import BaseComponent from "../BaseComponent";
import {formArrayToJson} from "../../helpers/helper";
import FacebookLogin from "../FacebookLogin";
import classNames from "classnames";
import {Link} from "react-router";

export default class Auth extends BaseComponent {

    loginFormSubmit(e) {
        e.preventDefault();
        let loginForm = $(this._login_form);
        this.props.actions.loginUser(formArrayToJson(loginForm.serializeArray()));
    }

    getLoginBlockTemplate() {


        let loginBlockTemplate = null;
        if (!this.props.data.userId) {


            let non_field_errors = this.getFieldErrors('non_field_errors', 'data', 'loginErrors')
            let username_errors = this.getFieldErrors('username', 'data', 'loginErrors')
            let password_errors = this.getFieldErrors('password', 'data', 'loginErrors')

            loginBlockTemplate = (
                <div className='login_block'>
                    <div className='errors'>
                        {non_field_errors}
                    </div>
                    <form
                        onSubmit={this.loginFormSubmit.bind(this)}
                        className='login_form'
                        ref={(c) => this._login_form = c}
                    >
                        <div className={classNames('form_field', {has_errors: username_errors})}>
                            {username_errors}
                            <input
                                type='text'
                                ref={(c) => this._username = c}
                                placeholder='Username'
                                className='user_username'
                                name='username'
                                required
                            />
                        </div>
                        <div className={classNames('form_field', {has_errors: password_errors})}>
                            {password_errors}
                            <input
                                ref={(c) => this._password = c}
                                placeholder='Password'
                                name='password'
                                type='password'
                                className='user_password'
                                required
                            />
                        </div>

                        <div className='notice'>
                            <div className='form_field'>
                                <p>

                                    <label>
                                        <input id='save_me'
                                               type='checkbox'
                                               defaultChecked={true}
                                               ref={(c) => this._saveMe = c}
                                               name='save_me'
                                               className='save_me'
                                        />
                                        Запомнить меня
                                    </label>

                                </p>
                            </div>
                        </div>


                        <input
                            type='submit'
                            value='Log in'
                            className='user_login btn btn-default'
                        />
                    </form>
                </div>
            )
        }
        return loginBlockTemplate;
    }

    getLoggedBlockTemplate() {
        if (!this.props.data.userId) return null;
        return (
            <div key='logged_block' className='logged_block'>


                <p className='name'>Logged as: <strong><Link activeClassName='active'
                                                             to={`/user/${this.props.data.userId}`}>{this.props.data.userName}</Link></strong>
                </p>

                <input
                    type='button'
                    value='Log out'
                    className='button button_small'
                    onClick={this.props.actions.logoutUser.bind(this)}
                />
            </div>
        )
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

    getUserBlock() {
        return (
            <div>
                {this.getLoginBlockTemplate()}
                <div className='bottom'>
                    {this.getSocialLoginTemplate()}
                </div>
            </div>
        )
    }

    render() {
        if (this.props.data.userId) {
            return this.getLoggedBlockTemplate();
        }
        return (
            <div>
                {this.getUserBlock()}
            </div>
        )

    }
}
