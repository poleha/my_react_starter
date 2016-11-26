import React, {PropTypes, Component} from "react";
import Auth from "../../components/Auth";
import {Link} from "react-router";

export default class Header extends Component {

    render() {
        return (

            <header className='head'>
                <Link to={'/'}>Main page</Link>
                <Link to={'/registration'}>Registration</Link>
                <Auth
                    data={this.props.auth}
                    actions={this.props.authActions}
                />
            </header>
        )

    }

}
