/**
 * Created by tutu on 16-2-2.
 */
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import {Promise} from "../../app/tools/Promise";
import Controller from "../../app/abstract/Controller";
import CoreApp from "../App";
import {Factory as PlaybookFactory} from "../playbook/Factory";
import {Base as BasePlaybook} from "../playbook/Base";
import {PlaybookModel} from "../model/playbook";
import {Playbook as PlaybookRecord} from "../model/playbook";
import * as Constant from "../Constant";

export default class Playbook extends Controller{

    protected app:CoreApp;

    constructor(app:CoreApp){
        super(app);
        this.setResultFun(this.resultHandle)
    }

    private resultHandle(req: express.Request, res: express.Response, next: any, result: any){
        return res.json(CoreApp.formatResult(result));
    }

    public get(id: number, req: express.Request, res: express.Response):Promise<any>{

    }

    public list(num: number = 20, start: number = 0, type: string, count: boolean = false, req: express.Request, res: express.Response):Promise<any>{

    }

    public add(type: string, param: any, req: express.Request, res: express.Response):Promise<any>{

    }

    public delete(id: number, req: express.Request, res: express.Response):Promise<any>{

    }
}