/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../typings/node/node.d.ts" />

import App from "../app/App";
import * as express from "express";
import coreRouter from "./router/core";
import webRouter from "./router/web";
import * as path from "path";
import * as Constant from "./Constant";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import Task from "./handle/Task";

class CoreApp extends App {

    protected name = "core";

    private _task: Task;

    constructor() {
        super();
    }

    protected init(): void {
        this.express.set("views", path.join(__dirname, "views"));
        this.express.set("view engine", "ejs");
        this.express.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 24*60*60*1000 }}));
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
        this.express.use(coreRouter(this), webRouter(this));

        this.listen(this.config.CORE_CONFIG.PORT);
        this.taskHandle();
    }

    public task(): Task {
        return this._task;
    }

    private taskHandle(): void {
        this._task = Task.getInstance(this).start();
    }

    /**
     * 错误处理handle
     */
    protected errorHandle(): void {
        this.express.use((req: express.Request, res: express.Response, next: any)=>{
            let error = new Error("no find!");
            error.name = Constant.NO_FIND;
            res.status(200).json(CoreApp.formatResult({}, error));
        });
        this.express.use((err: Error, req: express.Request, res: express.Response, next: any)=>{
            this.logger.error(err);
            res.status(200).json(CoreApp.formatResult({}, err));
        });
    }

    public static formatResult(data?: any,  err?: Error){
        let result: any = {};
        if(err){
            switch (err.name){
                case Constant.NO_FIND:
                    result.status = Constant.NO_FIND_STATUS;
                    break;
                case Constant.NEED_LOGIN:
                    result.status = Constant.NEED_LOGIN_STATUS;
                    break;
                default:
                    result.status = Constant.OTHER_ERROR_STATUS;
                    break;
            }
        }else{
            result.status = Constant.SUCCESS_STATUS;
        }
        result.message = err ? err.message : "success";
        result.data = data ? data : {};
        return result;
    }
}

export default CoreApp
