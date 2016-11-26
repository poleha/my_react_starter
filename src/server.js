const http = require('http');
const path = require('path')
const express = require('express');
var cookieParser = require('cookie-parser')
var compression = require('compression');
import React from "react";
import ReactDOM from "react-dom/server";
import Html from "./helpers/Html";
import {match} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import {ReduxAsyncConnect, loadOnServer} from "redux-async-connect";
import createHistory from "react-router/lib/createMemoryHistory";
import {Provider} from "react-redux";
import configureStore from "./store/configureStore";
import routes from "./routes";

const app = express();

if (__DEVELOPMENT__) {
    (function initWebpack() {
        const webpack = require('webpack');
        const webpackConfig = require('../webpack/common.config');
        const compiler = webpack(webpackConfig);
        app.use(require('webpack-dev-middleware')(compiler, {
            noInfo: true, publicPath: webpackConfig.output.publicPath,
        }));
        app.use(require('webpack-hot-middleware')(compiler, {
            log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
        }));
        app.use(express.static(path.join(__dirname, '..', '/')));

    })();
}
else {
    app.use(compression());
}

app.use(cookieParser())

app.use((req, res) => {

    const memoryHistory = createHistory(req.originalUrl);
    const store = configureStore({}, req);
    const history = syncHistoryWithStore(memoryHistory, store);

    match({history, routes: routes, location: req.originalUrl}, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
            res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            console.error('ROUTER ERROR:', error);
            res.status(500);
        } else if (renderProps) {
            loadOnServer({...renderProps, store}).then(() => {
                const component = (
                    <Provider store={store} key='provider'>
                        <ReduxAsyncConnect {...renderProps} />
                    </Provider>
                );
                res.status(200);
                global.navigator = {userAgent: req.headers['user-agent']};
                res.send('<!doctype html>\n' +
                    ReactDOM.renderToStaticMarkup(<Html component={component} store={store}/>));
            }).catch(error => {
                if (__DEVELOPMENT__) res.status(401).send(error.stack);
                else res.status(401).send('Server error');
            });

        } else {
            res.status(404).send('Page not found');
        }

    });

});


const server = http.createServer(app);
server.listen(process.env.PORT || 3000, function onListen() {
    const address = server.address();
    console.log('Listening on: %j', address);
    console.log(' -> that probably means: http://localhost:%d', address.port);
});
