/**
 * Created by tutu on 15-12-25.
 */

/// <reference path="../../../../libs/ts/immutable.d.ts" />
/// <reference path="../../../../libs/ts/common.d.ts" />
/// <reference path="../../../../libs/ts/react-router-redux.d.ts" />
/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../typings/react-redux/react-redux.d.ts" />
/// <reference path="../../../../typings/react-router/react-router.d.ts" />
/// <reference path="../../../../typings/history/history.d.ts" />

import * as React from "react";
import { Provider } from "react-redux";
import MainStore from "../store/Main";
import DevTools from "./DevTools";
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { apiMiddleware } from '../middleware/Api';

//路由页面
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import Error from "./Error";

interface ContainerProp {
    data:any;
}

class Container extends React.Component<ContainerProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    private getDevTools(){
        if(window.__DEV__){
            return <DevTools/>
        }
    }

    private getStore(){
        return MainStore(this.props.data, [apiMiddleware, routerMiddleware(browserHistory)]);
    }

    private getHistory(store: any){
        return syncHistoryWithStore(browserHistory, store);
    }

    private getRoutes(store: any){
        return (
            <Router history={this.getHistory(store)}>
                <Route path="/" component={App}/>
                <Route path="/checkPlaybook/:id" component={App}/>
                <Route path="/addPlaybook/:type" component={App}/>
                <Route path="login" component={Login}/>
                <Route path="register" component={Register}/>
                <Route path="*" component={Error}/>
            </Router>
        );
    }

    public render() {
        let store = this.getStore();
        return (
            <Provider store={store}>
                <div>
                    {this.getRoutes(store)}
                    {this.getDevTools()}
                </div>
            </Provider>
        );
    }
}

export default Container
