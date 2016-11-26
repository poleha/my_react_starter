import React, {PropTypes, Component} from "react";

export default class FacebookLogin extends Component {
    componentDidMount() {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '1656318291320966',
                xfbml: true,
                version: 'v2.8'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_EN/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    }

    render() {
        return (
            <a
                className='facebook_login_button'
                onClick={this.props.actions.FacebookLogin.bind(this)}
            >
                Login via facebook
            </a>
        )
    }
}