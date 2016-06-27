/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/react-router-redux.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import * as Constant from "../../../Constant";
import {router} from "./Main";
import {Api} from "../middleware/Api";

export function login(email: string, password: string) {
    return new Api("post", "/api/login", {email: email, password: password}).do((result: any)=>{
        return [{type: ActionTypes.LOGIN, value: {email: result.email}}, router("/")];
    });
}

export function register(email: string, password: string) {
    return new Api("post", "/api/register", {email: email, password: password}).do((result: any)=>{
        return [{type: ActionTypes.REGISTER, value: {email: result.email}}, router("/")];
    });
}

export function loginOut(){
    return new Api("post", "/api/loginOut", {}).do((result: any)=>{
        return [{ type: ActionTypes.LOGINOUT }, router("/login")];
    });
}
