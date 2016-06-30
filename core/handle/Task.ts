/**
 * Created by tutu on 15-12-21.
 */

import CoreApp from "../App";
import * as Constant from "../Constant";
import {Promise} from "../../app/tools/Promise";
import {EventEmitter} from "events";
import {Base as BasePlaybook} from "../playbook/Base";
import {Playbook, PlaybookModel} from "../model/playbook";
import {Logger} from "bunyan";
import {Factory as PlaybookFactory} from "../playbook/Factory";
import {Time} from "../../app/tools/Time";

interface TaskData{
    type: number;
    data: any;
}

export default class Task {

    private static instance: Task = null;
    private app: CoreApp = null;
    private logger: Logger = null;
    public events: EventEmitter = new EventEmitter();
    private taskList: TaskData[] = [];
    private ing: boolean = false;

    constructor(app: CoreApp){
        this.app = app;
        this.logger = this.app.logger;
    }

    public static getInstance(app:CoreApp): Task{
        if (!this.instance) {
            this.instance = new Task(app);
        }
        return this.instance;
    }

    public start():Task{
        this.events.on("add", this.add.bind(this));
        this.events.on("addTime", this.addTime.bind(this));
        this.events.on("next", this.next.bind(this));
        this.init();
        return this;
    }

    private init(){
        let playbookModel = new PlaybookModel(this.app);
        playbookModel.getWaitPlaybook().then((playbookList:Playbook[])=>{
            for(let i in playbookList){
                this.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbookList[i].id);
            }
        });
        this.events.emit("add", Constant.TASK_TYPE_AUTOPLAYBOOK);
    }

    private handleTask(){
        if(this.taskList.length > 0){
            this.ing = true;
            let task: TaskData = this.taskList.shift();
            let handle: Promise<any> = null;
            if (task.type == Constant.TASK_TYPE_PLAYBOOK){
                handle = this.handlePlaybookTask(task.data);
            }else if(task.type == Constant.TASK_TYPE_AUTOPLAYBOOK){
                handle = this.handleAutoPlaybook();
            }else if(task.type == Constant.TASK_TYPE_ADDPLAYBOOK){
                handle = this.handleAddPlaybook(task.data);
            }
            if(handle){
                handle.then((data: any)=>{
                        this.events.emit("next");
                    })
                    .catch((error: Error)=>{
                        console.log(error);
                        this.events.emit("next");
                    });
            }
        }else{
            this.ing = false;
        }
    }

    private handleAutoPlaybook(){
        let time = new Time();
        let typeMap = PlaybookFactory.getPlaybookTypeMap();
        for(let i in typeMap){
            if(typeMap[i].auto){
                if(time.judge(typeMap[i]["autoTime"])){
                    this.events.emit("add", Constant.TASK_TYPE_ADDPLAYBOOK, i);
                }
            }
        }

        this.events.emit("addTime", time.getTime(), Constant.TASK_TYPE_AUTOPLAYBOOK);
        return Promise.resolve(true);
    }

    private handleAddPlaybook(type: string):Promise<Playbook>{
        if(!PlaybookFactory.isHasPlaybook(type)) return Promise.reject(new Error("playbook type 不存在"));
        let playbookType = PlaybookFactory.getPlaybook(type);
        if(!playbookType) return Promise.reject(new Error("playbook type 选择错误"));
        playbookType = new playbookType(this.app);
        playbookType.setAuto(true);
        return playbookType.save().then((playbook:Playbook)=>{
            this.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbook.id);
            return playbook;
        });
    }

    private handlePlaybookTask(playbookId: number):Promise<Playbook>{
        return new PlaybookModel(this.app).get(playbookId)
            .then((playbook: Playbook)=>{
                if(!PlaybookFactory.isHasPlaybook(playbook.type)) return Promise.reject(new Error("playbook type 不存在"));
                let playbookType = PlaybookFactory.getPlaybook(playbook.type);
                if(!playbookType) return Promise.reject(new Error("playbook type 选择错误"));
                return new playbookType(this.app, playbook).start();
            });
    }

    private next(){
        this.handleTask();
    }

    private isDoing(){
        return this.ing;
    }

    private add(type: number, data: any){
        let taskData: TaskData = {
            type: type,
            data: data
        };
        this.taskList.push(taskData);
        if(!this.isDoing()) this.handleTask();
    }

    private addTime(time: number, type: number, data: any){
        let nowTime = new Time().getTime();
        let _time = time - nowTime;
        if(_time > 0){
            setTimeout(()=>{
                this.events.emit("add", type, data);
            }, _time);
        }else{
            this.events.emit("add", type ,data);
        }
    }
}


