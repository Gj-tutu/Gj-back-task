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
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord){
                return playbookRecord.toJson();
            }else{
                return {};
            }
        });
    }

    public list(num: number = 20, start: number = 0, type: string, count: boolean = false, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        let list:any[] = [];
        let where: any[] = [];
        if(type != "all"){
            where.push(["type", "=", type]);
        }
        list.push(playbookModel.getList(where, start, num).then((playbookRecordList:PlaybookRecord[])=>{
            let result:any[] = [];
            for(let i in playbookRecordList){
                result.push(playbookRecordList[i].toJson())
            }
            return result;
        }));
        if(count) list.push(playbookModel.getCount(where));
        return Promise.all(list).then((results:any[])=>{
            let result:any = {};
            result["list"] = results[0];
            if(count) result["count"] = results[1];
            return result;
        });
    }

    public add(type: string, param: any, req: express.Request, res: express.Response):Promise<any>{
        if(!PlaybookFactory.isHasPlaybook(type)) return Promise.reject(new Error("playbook type 不存在"));
        let playbookType = PlaybookFactory.getPlaybook(type);
        if(!playbookType) return Promise.reject(new Error("playbook type 选择错误"));
        playbookType = new playbookType(this.app);
        playbookType.setParam(JSON.parse(param));
        return playbookType.save().then((playbookRecord:PlaybookRecord)=>{
            let task = this.app.task();
            task.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbookRecord.id);
            return playbookRecord.toJson();
        });
    }

    public delete(id: number, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord.state == Constant.ING || playbookRecord.state == Constant.WAIT)
                throw new Error("playbook 执行中不允许删除");
            return playbookModel.delByKey(id).then(()=>{
                return {id: id};
            });
        });
    }
}