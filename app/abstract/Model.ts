/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import App from "../../app/App";
import {BaseModel, ModelHandle} from "./BaseModel";

export class Record{

    private data:any = {};

    protected fieldMap:any = {
        create_time: "createTime",
        update_time: "updateTime",
        delete_time: "deleteTime"
    };

    constructor(data?: any){
        if(data) this.data = data;
    }

    get(key: string): any{
        return this.data[key] === "undefined" ? "" : this.data[key];
    }

    set(key: string, val: any): any{
        this.data[key] = val;
    }

    get createTime(){
        return this.get("create_time");
    }

    get updateTime(){
        return this.get("update_time");
    }

    get deleteTime(){
        return this.get("delete_time");
    }

    public toJson(list?: string[]){
        let _self:any = this;
        if(!list){
            list = [];
            for(let i in this.data){
                list.push(i);
            }
        }
        let _data: any = {};
        for(let i in list){
            _data[list[i]] = this.fieldMap[list[i]] ? _self[this.fieldMap[list[i]]] : _self[list[i]];
        }
        return _data;
    }
}

export class Model extends BaseModel{

    protected tableName: string;
    protected key:string = "id";
    protected createTime:string = "create_time";
    protected updateTime:string = "update_time";
    protected deleteTime:string = "delete_time";
    protected field:string[];

    protected formatData(data: any):Record{
        let record:any = {};
        for(let i in data){
            record[i] = data[i];
        }
        return new Record(record);
    }

    public delByKey(key: number):Promise<any>{
        let data:any = {};
        data[this.deleteTime] = BaseModel.getTime();
        return this.updateByKey(key, data);
    }

    public recoveryByKey(key: number):Promise<any>{
        let data:any = {};
        data[this.deleteTime] = 0;
        return this.updateByKey(key, data);
    }

    public updateByKey(key: number, data:any):Promise<any>{
        let modelHandle: ModelHandle = {
            key: this.key,
            tableName: this.tableName,
            update: true,
            value: data,
            where: [[this.key, "=", key]]
        };
        return this.handle(modelHandle).then((result: any)=>{
            if(result["changedRows"] > 0){
                return data;
            }else{
                throw new Error("Model sql handle change 0");
            }
        });
    }

    public del(data: Record):Promise<Record>{
        data.set(this.deleteTime, BaseModel.getTime());
        return this.update(data);
    }

    public recovery(data: Record):Promise<Record>{
        data.set(this.deleteTime, 0);
        return this.update(data);
    }

    public get(key: number):Promise<Record>{
        let modelHandle: ModelHandle = {
            key: this.key,
            tableName: this.tableName,
            select: true,
            where: [[this.key, "=", key], [this.deleteTime, "=", 0]],
            order: `${this.key} DESC`,
            limit: "0,1"
        };
        return this.handle(modelHandle).then((result: any[])=>{
            if(!result || result.length <= 0) return null;
            return this.formatData(result[0]);
        });
    }

    public getList(where:any[] = [], startNum:number = 0, num:number = 100):Promise<Record[]>{
        where.push([this.deleteTime, "=", 0]);
        let modelHandle: ModelHandle = {
            key: this.key,
            tableName: this.tableName,
            select: true,
            where: where,
            order: `${this.key} DESC`,
            limit: `${startNum}, ${num}`
        };
        return this.handle(modelHandle).then((result: any[])=>{
            if(!result || result.length <= 0) return [];
            for(let i in result){
                result[i] = this.formatData(result[i]);
            }
            return result;
        });
    }

    public getOne(where:any[] = []):Promise<Record>{
        where.push([this.deleteTime, "=", 0]);
        let modelHandle: ModelHandle = {
            key: this.key,
            tableName: this.tableName,
            select: true,
            where: where,
            order: `${this.key} DESC`,
            limit: `0, 1`
        };
        return this.handle(modelHandle).then((result: any[])=>{
            if(!result || result.length <= 0) return null;
            return this.formatData(result[0]);
        });
    }

    public getCount(where:any[] = []):Promise<number>{
        where.push([this.deleteTime, "=", 0]);
        let modelHandle: ModelHandle = {
            key: this.key,
            tableName: this.tableName,
            select: true,
            where: where
        };
        return this.count(modelHandle);
    }

    public update(data: Record):Promise<Record>{
        data.set(this.updateTime, BaseModel.getTime());
        let keys: any[] = this.field;
        let values: any = {};
        for(let i=0;i<keys.length;i++){
            if(keys[i] == this.key){
                continue;
            }
            values[keys[i]] = data.get(keys[i]);
        }
        let modelHandle: ModelHandle = {
            key: this.key,
            tableName: this.tableName,
            update: true,
            value: values,
            where: [[this.key, "=", data.get(this.key)]]
        };
        return this.handle(modelHandle).then((result: any)=>{
            if(result["changedRows"] > 0){
                return data;
            }else{
                throw new Error("Model sql handle change 0");
            }
        });
    }

    public add(data: Record):Promise<Record>{
        data.set(this.createTime, BaseModel.getTime());
        let keys: any[] = this.field;
        let values: any = {};
        for(let i=0;i<keys.length;i++){
            if(keys[i] == this.key){
                continue;
            }
            values[keys[i]] = data.get(keys[i]);
        }
        let modelHandle: ModelHandle = {
            key: this.key,
            tableName: this.tableName,
            add: true,
            value: values
        };
        return this.handle(modelHandle).then((result: any)=>{
            data.set(this.key, result["insertId"]);
            return data;
        });
    }

    public save(data: Record):Promise<any>{
        if(data.get(this.createTime)){
            return this.update(data);
        }else{
            return this.add(data);
        }
    }
}