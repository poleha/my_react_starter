import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import withScroll from 'scroll-behavior';

import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import configureStore from './store/configureStore'

const dest = document.getElementById('app_root');
const appHistory = withScroll(browserHistory);
const store = configureStore(window.__data);
const history = syncHistoryWithStore(appHistory, store); 

render(
    <Root store={store} history={history} />,
    dest
);

if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger

    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
        console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
    }
}

if (module.hot) {
    module.hot.accept();
}
