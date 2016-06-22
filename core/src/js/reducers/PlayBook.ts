/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";
import objectAssign = require("object-assign");

export interface playbookData{
    map: any,
    typeMap: any,
    typeList: string[],
    showList: number[],
    count: any,
    type: string
}

const initialValue: playbookData = {
    map: {},
    typeMap: {},
    typeList: [],
    showList: [],
    count: {all: 0},
    type: "all"

};

function PlayBook(state = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.ADD_PLAYBOOK:
            state.map[action.value.id] = action.value;
            state.showList = filter(state.map, state.type);
            return objectAssign({}, state);
        case ActionTypes.UPDATE_PLAYBOOK:
            state.map[action.value.id] = action.value;
            state.showList = filter(state.map, state.type);
            return objectAssign({}, state);
        case ActionTypes.UPDATE_PLAYBOOK_LIST:
            state.count[action.value.type] = action.value.count;
            for(let i in action.value.list){
                state.map[action.value.list[i].id] = action.value.list[i];
            }
            state.showList = filter(state.map, state.type);
            return objectAssign({}, state);
        case ActionTypes.DELETE_PLAYBOOK:
            delete state.map[action.value.id];
            state.showList = filter(state.map, state.type);
            return objectAssign({}, state);
        case ActionTypes.SELECT_PLAYBOOK_TYPE:
            state.type = action.value;
            state.showList = filter(state.map, state.type);
            return objectAssign({}, state);
        case ActionTypes.UPDATE_PLAYBOOK_TYPE:
            state.typeMap = action.value.typeMap;
            state.typeList = action.value.typeList;
            return objectAssign({}, state);
        default:
            return state;
    }
}

function filter(map: any, type: string){
    let list: number[] = [];
    for(let i in map){
        if(type != "all"){
            if(map[i].type == type){
                list.push(map[i].id);
            }
        }else{
            list.push(map[i].id);
        }
    }
    list.sort((a,b)=>{return b-a;});
    return list;
}

export default PlayBook
