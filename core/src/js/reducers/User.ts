/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/object-assign.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import objectAssign = require("object-assign");

const initialValue = {email: ""};

function User(state = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            state.email = action.value.email;
            return objectAssign({}, state);
        case ActionTypes.REGISTER:
            state.email = action.value.email;
            return objectAssign({}, state);
        case ActionTypes.LOGINOUT:
            state.email = "";
            return objectAssign({}, state);
        default:
            return state;
    }
}

export default User
