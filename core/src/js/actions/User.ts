/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/react-router-redux.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import * as Constant from "../../../Constant";
import {ajaxHandle, router} from "./Main";

export function login(email: string, password: string) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/login", {email: email, password: password}, dispatch)
            .then((result: any)=>{
                    dispatch({type: ActionTypes.LOGIN, value: {email: result.email}});
                    dispatch(router("/"));
            });
    };
}

export function register(email: string, password: string) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/register", {email: email, password: password}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.REGISTER, value: {email: result.email}});
                dispatch(router("/"));
            });
    };
}

export function loginOut(){
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/loginOut", {}, dispatch)
            .then(()=>{
                dispatch({ type: ActionTypes.LOGINOUT });
                dispatch(router("/login"));
            });
    };
}
