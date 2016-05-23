/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/object-assign.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import objectAssign = require("object-assign");

interface defaultValue {
    isLoad:boolean;
    loading:any[];
}

const initialValue:defaultValue = {
    isLoad:false,
    loading:[]
};

function Loading(state:defaultValue = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.LOAD:
            state.isLoad = true;
            state.loading.push(true);
            return objectAssign({}, state);
        case ActionTypes.LOADED:
            state.loading.pop();
            if(state.loading.length>0){
                state.isLoad = true;
            }else{
                state.isLoad = false;
            }
            return objectAssign({}, state);
        default:
            return state;
    }
}

export default Loading
