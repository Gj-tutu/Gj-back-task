/**
 * Created by tutu on 16-3-17.
 */

///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import {Playbook, PlaybookModel} from "../model/playbook";
import CoreApp from "../App";
import * as Constant from "../Constant";
import {EventEmitter} from "events";
import {getTime} from "../../app/tools/Util";

export class Script{
    private name:string;
    private state:number;
    private handleState:number;
    private resultState:number;
    private overTime:number;
    private events:EventEmitter;

    public static NAME = "n";
    public static STATE = "s";
    public static H_STATE = "hs";
    public static R_STATE = "rs";
    public static OVER_TIME = "ot";

    constructor(data:any, events:EventEmitter){
        this.events = events;
        this.name = data[Script.NAME] ? data[Script.NAME] : "";
        this.state = data[Script.STATE] ? data[Script.STATE] : Constant.WAIT;
        this.handleState = data[Script.H_STATE] ? data[Script.H_STATE] : Constant.UNKNOWN;
        this.resultState = data[Script.R_STATE] ? data[Script.R_STATE] : Constant.UNKNOWN;
        this.overTime = data[Script.OVER_TIME] ? data[Script.OVER_TIME] : Constant.UNKNOWN;
    }

    public init(){
        this.events.emit("registerScript", this);
        return this;
    }

    public getName(){
        return this.name;
    }

    public checkState(){
        return this.state;
    }

    public start(){
        this.setState(Constant.ING);
        this.events.emit("execScript", this.name);
    }

    public cancel(){
        if(this.state != Constant.END || this.state != Constant.BREAK){
            this.setState(Constant.CANCEL)
        }
    }

    public error(){
        if(this.state != Constant.END){
            this.setState(Constant.BREAK, Constant.FAIL)
        }
    }

    private setState(state:number, handleState?:number, resultState?:number){
        this.state = state;
        if(handleState) this.handleState = handleState;
        if(resultState) this.resultState = resultState;
        this.overTime = getTime()
    }

    public end(resultState?:number){
        this.setState(Constant.END, Constant.SUCCESS, resultState);
        this.events.emit("scriptSaveEnd");
    }

    public toFormat(){
        return Script.format([this.name, this.state, this.handleState, this.resultState, this.overTime])
    }

    public static initFormat(data:any){
        return Script.format([data["name"], Constant.WAIT, Constant.UNKNOWN, Constant.UNKNOWN, Constant.UNKNOWN])
    }

    private static format(data:any){
        let n=Script.NAME,s=Script.STATE,hs=Script.H_STATE,rs=Script.R_STATE,ot=Script.OVER_TIME;
        let _format:any = {};
        _format[n] = data[0];
        _format[s] = data[1];
        _format[hs] = data[2];
        _format[rs] = data[3];
        _format[ot] = data[4];
        return _format;
    }
}

export class ScriptGroup{
    private group:any[];
    private state:number;
    private type:number;
    private events:EventEmitter;

    public static STATE = "s";
    public static LIST = "l";
    public static TYPE = "t";

    public static TYPE_LIST = 1;
    public static TYPE_PARALLEL = 2;

    constructor(data:any, events:EventEmitter){
        this.events = events;
        this.group = data[ScriptGroup.LIST] ? data[ScriptGroup.LIST] : [];
        this.state = data[ScriptGroup.STATE] ? data[ScriptGroup.STATE] : Constant.WAIT;
        this.type = data[ScriptGroup.TYPE] ? data[ScriptGroup.TYPE] : ScriptGroup.TYPE_LIST;
        for(let i in this.group){
            if(this.group[i][ScriptGroup.LIST]){
                this.group[i] = new ScriptGroup(this.group[i], events);
            }else{
                this.group[i] = new Script(this.group[i], events).init();
            }
        }
    }

    public start(){
        for(let i in this.group){
            if(this.group[i][ScriptGroup.LIST]){
                if(this.group[i].checkState() == Constant.GROUP_WAIT || this.group[i].checkState() == Constant.GROUP_ING){
                    return this.group[i].start();
                }
            }else{
                if(this.group[i].checkState() == Constant.WAIT){
                    this.group[i].start();
                    return true;
                }
            }
        }
        return false;
    }

    public cancel(){
        if(this.state != Constant.GROUP_END){
            this.state = Constant.GROUP_CANCEL
        }
        for(let i in this.group){
            this.group[i].cancel();
        }
    }

    public checkState(){
        if(this.state == Constant.GROUP_CANCEL) return this.state;
        let end:number = 0;
        let wait:number = 0;
        for(let i in this.group){
            let state = this.group[i].checkState();
            if(this.group[i][ScriptGroup.LIST]){
                if(state == Constant.GROUP_END){
                    end++;
                }else{
                    wait++;
                }
            }else{
                if(state == Constant.END){
                    end++;
                }else{
                    wait++;
                }
            }
        }
        if(end == 0) this.state = Constant.GROUP_WAIT;
        if(wait == 0) this.state = Constant.GROUP_END;
        if(end > 1 && wait != 0) this.state = Constant.GROUP_ING;
        return this.state;
    }

    public toFormat(){
        let _group:any[] = [];
        for(let i in this.group){
            _group.push(this.group[i].toFormat());
        }
        return ScriptGroup.format([_group, this.state, this.type, 1]);
    }

    public static initFormat(data:any){
        let _group:any[] = [];
        if(data["list"]){
            for(let i in data["list"]){
                _group.push(ScriptGroup.initFormat(data["list"][i]))
            }
            return ScriptGroup.format([Constant.GROUP_WAIT, _group, ScriptGroup.TYPE_LIST])
        }else{
            return Script.initFormat(data);
        }
    }

    private static format(data:any[]){
        let s=ScriptGroup.STATE,l=ScriptGroup.LIST,t=ScriptGroup.TYPE;
        let _format:any = {};
        _format[s] = data[0];
        _format[l] = data[1];
        _format[t] = data[2];
        return _format;
    }
}

export class ScriptDispatch{
    private script:ScriptGroup = null;
    private events:EventEmitter = new EventEmitter();
    private scriptList: any = {};
    constructor(script:any){
        this.events.on("registerScript", this.registerScript.bind(this));
        if(script[ScriptGroup.LIST]){
            this.script = new ScriptGroup(script, this.events);
        }
    }

    private execScript(name:string){
        this.events.emit("scriptHandle", this.getScript(name));
    }

    private registerScript(script:Script){
        this.scriptList[script.getName()] = script;
    }

    private scriptSaveEnd(){
        if(this.script){
            this.script.checkState();
            this.events.emit("scriptEnd");
        }
    }

    public start(){
        this.events.on("execScript",this.execScript.bind(this));
        this.events.on("scriptSaveEnd", this.scriptSaveEnd.bind(this));
        this.next();
    }

    private end(){
        this.events.emit("end");
        this.events.removeAllListeners();
    }

    public cancel(error?:Error){
        if(this.script){
            this.script.cancel();
        }
        this.events.emit("cancel", error);
        this.events.removeAllListeners();
    }

    public next(){
        if(!this.doScript()){
            this.end();
        }
    }

    public scriptEnd(scriptName:string, resultState:number){
        this.getScript(scriptName).end(resultState);
    }

    public scriptError(name:string, error:Error){
        this.getScript(name).error();
        this.cancel(error);
    }

    public getScript(name:string){
        return this.scriptList[name]
    }

    private doScript(){
        if(this.script){
            if(this.script.start()){
                return true;
            }
        }
        return false;
    }

    public onScriptHandle(callback:(script:Script)=>any){
        this.events.on("scriptHandle", callback);
    }

    public onEnd(callback:()=>any){
        this.events.on("end", callback)
    }

    public onCancel(callback:(error?:Error)=>any){
        this.events.on("cancel", callback);
    }

    public onScriptEnd(callback:(script:Script)=>any){
        this.events.on("scriptSaveEnd", callback);
    }

    public toFormat(){
        return this.script ? this.script.toFormat() : {};
    }

    public static initFormat(data:any){
        let _result = {};
        if(data["list"]){
            _result = ScriptGroup.initFormat(data);
        }else{
            let _initScriptGroup:any = {};
            _initScriptGroup["list"] = [data];
            _result = ScriptGroup.initFormat(_initScriptGroup);
        }
        return _result;
    }
}

export interface ScriptResult{
    resultState:number;
    data:any;
    command:number;
}

export interface Setting{
    name: string;
    title: string;
    auto: boolean;
    autoTime?: number;
}

export class Base{

    protected app: CoreApp;
    protected playbook: Playbook;
    protected playbookModel: PlaybookModel;

    protected name: string = "base";

    protected scripts: any = {};

    private scriptDispatch:ScriptDispatch;

    private scriptResolve:(value: any) => any | Thenable<any>;
    private scriptReject:(error: any) => any | Thenable<any>;

    private scriptHandleFun:(script: Script) => Promise<ScriptResult>;

    constructor(app: CoreApp, playbook?: Playbook){
        this.app = app;
        if(playbook){
            this.playbook = playbook;
        }else{
            this.playbook = new Playbook();

        }
        this.playbookModel = new PlaybookModel(app);
    }

    public setParam(param: any){
        this.playbook.param = param;
        return this;
    }

    public getParam(name: string){
        return this.playbook.param[name] ? this.playbook.param[name] : null;
    }

    public setAuto(auto: boolean){
        this.playbook.auto = auto ? 1 : 0;
        return this;
    }

    protected setHandleFun(fun:(script: Script) => Promise<ScriptResult>){
        this.scriptHandleFun = fun;
        return this;
    }

    protected init(){
        if(!this.playbook.id){
            this.playbook.state = Constant.WAIT;
            this.playbook.type = this.name;
            this.playbook.script = ScriptDispatch.initFormat(this.scripts);
            this.playbook.result = {};
            this.playbook.param = {};
            this.playbook.auto = 0;
        }
    }

    public start(){
        this.scriptDispatch = new ScriptDispatch(this.playbook.script);
        this.scriptDispatch.onScriptHandle(this.scriptHandle.bind(this));
        this.scriptDispatch.onEnd(this.end.bind(this));
        this.scriptDispatch.onCancel(this.cancel.bind(this));
        this.scriptDispatch.onScriptEnd(this.scriptEnd.bind(this));
        this.playbook.state = Constant.ING;
        this.save();
        this.scriptDispatch.start();
        return new Promise((resolve, reject)=>{
            this.scriptResolve = resolve;
            this.scriptReject = reject;
        });
    }

    private addResult(scriptName:string, result:any){
        let _result = this.playbook.result;
        _result[scriptName] = result;
        this.playbook.result = _result;
    }

    protected getResult(scriptName:string){
        return this.playbook.result[scriptName];
    }

    private scriptHandle(script:Script){
        return Promise.resolve(this.scriptHandleFun(script))
            .then((result:ScriptResult)=>{
                this.addResult(script.getName(), result.data);
                this.scriptDispatch.scriptEnd(script.getName(), result.resultState);
                if(result.command == Constant.SCRIPT_CANCEL_COMMAND){
                    this.scriptDispatch.cancel();
                }else{
                    this.scriptDispatch.next();
                }
            })
            .catch((error:Error)=>{
                this.addResult(script.getName(), error.message);
                this.scriptDispatch.scriptError(script.getName(), error);
            });
    }

    private saveScript(){
        this.playbook.script = this.scriptDispatch.toFormat();
        return this.save();
    }

    private scriptEnd(){
        this.saveScript();
    }

    private end(){
        this.playbook.state = Constant.END;

        this.saveScript().then(()=>{
            this.scriptResolve(this.playbook);
        });
    }

    private cancel(error?:Error){
        if(!error){
            this.playbook.state = Constant.CANCEL;
            this.saveScript().then(()=>{
                this.scriptResolve(this.playbook);
            });
        }else{
            this.playbook.state = Constant.BREAK;
            this.saveScript().then(()=>{
                this.scriptReject(error);
            });
        }
    }

    private static doHandle(script:Script):Promise<ScriptResult>{
        let result:ScriptResult = {
            resultState: Constant.NORMAL,
            command: Constant.SCRIPT_NEXT_COMMAND,
            data: {}
        };
        return Promise.resolve(result);
    }

    public save():Promise<any>{
        return this.playbookModel.save(this.playbook);
    }

}