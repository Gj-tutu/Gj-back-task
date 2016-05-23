/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/object-assign.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import objectAssign = require("object-assign");

interface defaultValue {
    left: boolean;
    message: string;
}

const initialValue:defaultValue = {
    left: false,
    message: ""
};

function Style(state:defaultValue = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.LEFT_SHOW:
            state.left = !state.left;
            return objectAssign({}, state);
        case ActionTypes.MESSAGE:
            state.message = action.value;
            return objectAssign({}, state);
        default:
            return state;
    }
}

export default Style
