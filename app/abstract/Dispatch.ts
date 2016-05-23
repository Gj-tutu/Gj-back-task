/**
 * Created by apple on 16/1/13.
 */

/// <reference path="../../typings/express-session/express-session.d.ts" />

import * as session from"express-session";
import * as express from "express";
import App from "../App";
import {RequestHandler} from "express";
class Dispatch{

    private static result(handle:(req: express.Request)=>Promise<any>):RequestHandler{
        return function(req: express.Request, res: express.Response, next: any) {
            handle(req).then(function(){
                next();
            }).catch(function(err:Error){
                next(err);
            });
        }
    }

    /**
     * 访问验证middle
     * @param app
     * @param tokenKey
     * @param verify
     * @returns {function(express.Request): *}
     */
    public static token(app: App, tokenKey: string, verify: (token:string) => Promise<any>):RequestHandler{

        function handle(req: express.Request):Promise<any>{
            if (!req.header(tokenKey)) {
                return Promise.reject(new Error("auth error"));
            } else {
                let token = req.header(tokenKey);
                return Promise.resolve(verify(token)).then(function(result){
                    if(result){
                        return true;
                    }else{
                        throw new Error('auth fail');
                    }
                });
            }
        }

        return this.result(handle);
    }

    /**
     * session验证middle
     * @param app
     * @param filterUrl
     * @param verify
     * @returns {function(express.Request): undefined}
     */
    public static session(app: App, filterUrl: string[], verify: (session: {[key: string]: any}) => Promise<any>):RequestHandler{
        function handle(req: express.Request):Promise<any>{
            if(filterUrl.indexOf(req.baseUrl) !== -1){
                return Promise.resolve();
            }else{
                return Promise.resolve(verify(req.session)).then(function(result){
                    if(result){
                        return true;
                    }else{
                        throw new Error("need login");
                    }
                });
            }
        }
        return this.result(handle);
    }
}

export default Dispatch