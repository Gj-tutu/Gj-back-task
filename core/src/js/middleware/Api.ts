/**
 * Created by tutu on 16-1-4.
 */

import Ajax from "../../../../app/tools/Ajax";
import {router} from "../actions/Main";
import {message} from "../actions/Main";
import * as Constant from "../../../Constant";
import * as ActionTypes from "../constants/ActionTypes";
import {load} from "../actions/Main";
import {loaded} from "../actions/Main";

export class Api{

    private method: string = "";
    private url: string = "";
    private data: any = {};
    private handle: (result:any)=>{};

    constructor(method: string, url:string, data: any){
        this.method = method;
        this.url = url;
        this.data = data;
    }

    public before(){
        return load();
    }

    public after(){
        return loaded();
    }

    public do(handle:(result: any)=>{}){
        this.handle = handle;
        return this;
    }

    public ajax(){
        let handle = Promise.reject(new Error("请求错误"));
        if(this.method == "post"){
            handle = Ajax.post(this.url, this.data);
        }else if(this.method == "get"){
            handle = Ajax.get(this.url, this.data);
        }

        return handle.catch(function(error){
            return Promise.reject(message(error.message));
        }).then((result: any)=>{
            if(!result) return Promise.reject(false);
            let status = result.status;
            if(status == Constant.SUCCESS_STATUS){
                return result.data;
            }else if(status == Constant.NEED_LOGIN_STATUS){
                return Promise.reject([{type: ActionTypes.LOGINOUT}, router("/login")]);
            }else{
                return Promise.reject(message(result.message));
            }
        });
    }
}

export function apiMiddleware({ dispatch, getState }) {
    return (next: any) => (action: any) =>{
        console.log(action);
        if(action instanceof Api){
            dispatch(action.before);
            action.ajax().then((result:any)=>{
                result = action.handle(result);
                if(result instanceof Array){
                    for(let i in result){
                        dispatch(result[i]);
                    }
                }else{
                    dispatch(result);
                }
                dispatch(action.after);
            }).catch((result:any)=>{
                if(result instanceof Array){
                    for(let i in result){
                        dispatch(result[i]);
                    }
                }else{
                    dispatch(result);
                }
                dispatch(action.after);
            });
        }else{
            next(action)
        }
    }
}
