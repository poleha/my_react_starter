import React, {PropTypes, Component} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import config from "../../config";

export default class BaseComponent extends Component {
    getPathChanged(otherProps) {
        return this.props.params.tag != otherProps.params.tag;
    }
    
    getFieldErrors(fieldName, dataName, propName = 'errors',) {
        let fieldErrors = this.props[dataName][propName][fieldName];
        if (fieldErrors) {
            let errorsBlock;
            if (fieldErrors instanceof Array) {
                errorsBlock = fieldErrors.map(function (error, index) {
                    return (
                        <li className='error' key={index}>
                            {error}
                        </li>
                    )
                });
            }
            else {
                errorsBlock = (
                    <li className='error' key='0'>
                        {fieldErrors}
                    </li>
                )
            }
            return (
                <ReactCSSTransitionGroup
                    transitionName='errors'
                    transitionAppear={true}
                    transitionAppearTimeout={1000}
                    transitionEnterTimeout={1000}
                    transitionLeaveTimeout={1}
                    className='errors'
                    component='div'
                >
                    <ul>
                        {errorsBlock}
                    </ul>
                </ReactCSSTransitionGroup>
            )
        }
    }

    processSmileyText(text) {
        let changedText = text;

        config.smiley.forEach((smiley) => {
            changedText = changedText.replace(smiley.data, `<img src='/static/images/smileys/${smiley.filename}' alt='${smiley.alt}'/>`)
        })
        return <p dangerouslySetInnerHTML={{__html: changedText}}/>
    }
}
