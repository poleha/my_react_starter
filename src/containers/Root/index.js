import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect } from 'redux-async-connect'
import routes from '../../routes'
import { Router } from 'react-router'

export default class Root extends Component {
    
    render() {
        const { store, history } = this.props
        return (
            <Provider store={store}>
                <Router history={history} key='provider' routes={routes} render={(props) =>
                <ReduxAsyncConnect { ...props } />}
                />
            </Provider>
        )
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}

