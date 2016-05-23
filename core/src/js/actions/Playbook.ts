/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/react-router-redux.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import {ajaxHandle, router} from "./Main";

export function get(id: number) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("get", `/api/playbook/get/${id}`, {}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.UPDATE_PLAYBOOK, value: result});
            });
    };
}
export function list(num: number, start: number, type: string = "all") {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        let queryData = {num: num, start: start, type: type, count: true};
        ajaxHandle("get", "/api/playbook/list", {num: num, start: start, type: type, count: true}, dispatch)
            .then((result: any)=>{
                result["type"] = type;
                dispatch({type: ActionTypes.UPDATE_PLAYBOOK_LIST, value: result});
            });
    };
}
export function add(type: string, param: any) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/playbook/add", {type: type, param: JSON.stringify(param)}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.ADD_PLAYBOOK, value: result});
                dispatch(router(`/checkPlaybook/${result.id}`));
            });
    };
}
export function del(id: number) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/playbook/delete", {id: id}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.DELETE_PLAYBOOK, value: result});
            });
    };
}

export function selectType(type: string){
    return {type: ActionTypes.SELECT_PLAYBOOK_TYPE, value: type}
}