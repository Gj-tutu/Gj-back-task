/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import CoreApp from "../App";
import * as Constant from "../Constant";
import {Record, Model} from "../../app/abstract/Model";
import {md5} from "../../app/tools/StringHandle";
import {ModelHandle} from "../../app/abstract/BaseModel";

export class Playbook extends Record{

    get id(){
        return this.get("id");
    }

    get type(){
        return this.get("type");
    }
    set type(type:string){
        this.set("type", type);
    }

    get state(){
        return this.get("state");
    }
    set state(state:number){
        this.set("state", state);
    }

    get auto(){
        return this.get("auto");
    }
    set auto(auto:number){
        this.set("auto", auto);
    }

    private _result:any = null;

    get result(){
        if(!this._result){
            this._result = JSON.parse(this.get("result"));
        }
        return this._result;
    }
    set result(result:any){
        this._result = result;
        this.set("result", JSON.stringify(this._result));
    }

    private _script:any = null;

    get script(){
        if(!this._script){
            this._script = JSON.parse(this.get("script"));
        }
        return this._script;
    }
    set script(script:any){
        this._script = script;
        this.set("script", JSON.stringify(this._script));
    }

    private _param:any = null;

    get param(){
        if(!this._param){
            this._param = JSON.parse(this.get("param"));
        }
        return this._param;
    }
    set param(param:any){
        this._param = param;
        this.set("param", JSON.stringify(this._param));
    }
}

export class PlaybookModel extends Model{

    protected tableName = "core_playbook";

    public key: string = "id";

    public filed: string[] = ["id", "type", "auto", "state", "script", "param", "result", "create_time", "update_time", "delete_time"];

    protected formatData(data: any){
        let record:any = {};
        for(let i in data){
            record[i] = data[i];
        }
        return new Playbook(record);
    }

    public getWaitPlaybook():Promise<Playbook[]>{
        let where = [["state", "in", `${Constant.WAIT},${Constant.ING}`]];
        return this.getList(where);
    }

    public getTypeLastPlaybook(type: string, auto: boolean){
        let modelHandle: ModelHandle = {
            tableName: this.tableName,
            select: true,
            where: [["type", "=", type]],
            order: `${this.updateTime} DESC`,
            limit: "0,1"
        };
        if(auto){
            modelHandle.where.push(["auto", "=", "1"]);
        }
        return this.handle(modelHandle).then((result: any[])=>{
            if(!result || result.length <= 0) return {};
            return this.formatData(result[0]);
        });
    }
}