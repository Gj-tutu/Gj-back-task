/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/redux/redux.d.ts" />
/// <reference path="../../../../typings/redux-thunk/redux-thunk.d.ts" />
/// <reference path="../../../../libs/ts/redux-dev-tools.d.ts" />
/// <reference path="../../../../libs/ts/common.d.ts" />

import { compose, createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/Index";
import { persistState } from "redux-devtools";
import DevTools from "../containers/DevTools";
import * as thunk from "redux-thunk";


function buildStore(middleware:any[] = []){
    middleware.push(thunk);
    if(window.__DEV__){
        return compose(
            applyMiddleware(...middleware),
            // Required! Enable Redux DevTools with the monitors you chose
            DevTools.instrument()
            // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
            //persistState(getDebugSessionKey())
        )(createStore);
    }else{
        return compose(
            applyMiddleware(...middleware)
        )(createStore);
    }
}

// const buildStore = applyMiddleware(thunk)(createStore);

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = typeof window === "object" ? window.location.href.match(/[?&]debug_session=([^&]+)\b/) : "";
  return (matches && matches.length > 0)? matches[1] : null;
}

export default function MainStore(initialState?: any, middleware: any[] = []) {
  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  // if (module.hot) {
  //  module.hot.accept('../reducers', () =>
  //    store.replaceReducer(require('../reducers')/*.default if you use Babel 6+ */)
  //  );
  // }
  return buildStore(middleware)(rootReducer, initialState);
}
