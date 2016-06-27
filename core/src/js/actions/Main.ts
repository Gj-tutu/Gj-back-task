/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/react-router-redux.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import { push } from 'react-router-redux';
import * as Constant from "../../../Constant";


export function message(message: string){
    return { type: ActionTypes.MESSAGE, value: message };
}

export function load() {
    return { type: ActionTypes.LOAD };
}

export function loaded() {
    return { type: ActionTypes.LOADED };
}

export function leftShow() {
    return { type: ActionTypes.LEFT_SHOW };
}

export function router(path: string) {
    return push(path);
}
