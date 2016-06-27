/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/react-router-redux.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import {Api} from "../middleware/Api";
import {router} from "./Main";

export function get(id: number) {
    return new Api("get", `/api/playbook/get/${id}`, {}).do((result: any)=>{
        return {type: ActionTypes.UPDATE_PLAYBOOK, value: result};
    });
}
export function list(num: number, start: number, type: string = "all") {
    return new Api("get", "/api/playbook/list", {num: num, start: start, type: type, count: true}).do((result: any)=>{
            result["type"] = type;
            return {type: ActionTypes.UPDATE_PLAYBOOK_LIST, value: result};
        });
}
export function add(type: string, param: any) {
    return new Api("post", "/api/playbook/add", {type: type, param: JSON.stringify(param)}).do((result: any)=>{
        return[{type: ActionTypes.ADD_PLAYBOOK, value: result}, router(`/checkPlaybook/${result.id}`)];
    });
}
export function del(id: number) {
    return new Api("post", "/api/playbook/delete", {id: id}).do((result: any)=>{
        return {type: ActionTypes.DELETE_PLAYBOOK, value: result};
    });
}
export function init() {
    return new Api("get", "/api/playbook/init", {}).do((result: any)=>{
        result["type"] = "all";
        return [{type: ActionTypes.UPDATE_PLAYBOOK_LIST, value: result}, {type: ActionTypes.UPDATE_PLAYBOOK_TYPE, value: result}];
    });
}

export function selectType(type: string){
    return {type: ActionTypes.SELECT_PLAYBOOK_TYPE, value: type}
}