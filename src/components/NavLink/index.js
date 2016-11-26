import React, {Component} from "react";
import {Link} from "react-router";
import classNames from "classnames";

function onClick(disabled, e) {
    if (disabled) e.preventDefault();
}

export default class NavLink extends Component {
    render() {
        //let link = super.render();
        let boundOnClick = onClick.bind(this, this.props.disabled)
        return (
            <li className={classNames(this.props.className, {disabled: this.props.disabled})}>
                <Link {...this.props} onClick={boundOnClick}/>
            </li>
        )
    }
}