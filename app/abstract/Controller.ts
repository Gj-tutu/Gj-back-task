/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../../typings/express/express.d.ts" />
import * as express from "express";
import App from "../App";


interface ParamDesc {
    name: string;
    /**
     * 只能设置一个,获取整个body
     */
    body?: boolean;
    query?: boolean;
    form?: boolean;
    param?: boolean;
    /**
     * 参数在path中,位数按index计算
     */
    path?: boolean;
    /**
     * 默认为0,用于设定path的参数,从后向前
     */
    index?: number;
    /**
     * 针对query的数组支持
     */
    array?: boolean;
}

class Controller{
    protected app:App;
    private resultFun:(req: express.Request, res: express.Response, next: any, result: any)=>{};


    public constructor(app: App){
        this.app = app;
        this.setResultFun(this.__resultHandle);
    }

    protected setResultFun(fun:(req: express.Request, res: express.Response, next: any, result: any)=>{}){
        this.resultFun = fun;
    }

    /**
     * 处理请求参数解写
     * @param param
     * @param action
     * @returns {function(express.Request, express.Response, any): void}
     */
    public handle(param:any[], action:(...args:any[])=>Promise<any>) {
        return (req: express.Request, res: express.Response, next: any):void=>{
            let args = param.map((value:ParamDesc)=>{
                if(value.body){
                    return req.body;
                }else if(value.query){
                    let v:string = req.query[value.name];
                    return value.array ? v.split(',') : v;
                }else if(value.path){
                    let a:string[] = req.path.split("/");
                    return value.index ? a.splice(a.length - value.index - 1, 1) : a.pop();
                }else if(value.form){
                    return req.body[value.name];
                }else if(value.param){
                    return req.params[value.name]
                }
            });
            args.push(req);
            args.push(res);
            action.apply(this, args).then((result: any)=>{
                return this.resultFun(req, res, next, result)
            }).catch((err:Error)=>{
                next(err);
            });
        }
    }

    private __resultHandle(req: express.Request, res: express.Response, next: any, result: any){
        return res.json(result)
    }
}

export default Controller



