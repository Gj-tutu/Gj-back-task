/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import App from "../../app/App";

export interface ModelHandle{
    select?:boolean;
    add?:boolean;
    update?:boolean;

    tableName:string;
    where?:any[];
    field?:string[];
    value?:any;
    limit?:string;
    order?:string;

    key?:string;
}

export class MockModel{

    private mockRecord: any[] = [];

    public constructor(mockRecord: any[]){
        this.mockRecord = mockRecord;
    }

    public exec(sql: string):any{
        throw new Error(`[DB] MOCK MODEL not do exec sql ${sql}`); 
    }

    public handle(modelHandle: ModelHandle):any{
        let _data: any = {};
        if(modelHandle.select){
            let sData: any[] = [];
            if(modelHandle.where){
                sData = this.mockRecord.filter((item:any)=>{
                    return MockModel.where(item, modelHandle.where);
                });
            }else{
                sData = this.mockRecord;
            }
            _data = sData;
        }else if(modelHandle.add){
            let nData:any = {};
            for(let i in modelHandle.value){
                nData[i] = _data[modelHandle.value[i]]
            }
            if(modelHandle.key){
                _data['insertId'] = this.mockRecord.length;
                nData[modelHandle.key] = _data['insertId']
            }
            this.mockRecord.push(nData);
            _data['changedRows'] = 1
        }else if(modelHandle.update){
            let uData:any[] = [];
            if(modelHandle.where){
                uData = this.mockRecord.filter((item:any)=>{
                    return MockModel.where(item, modelHandle.where);
                });
            }else{
                uData = this.mockRecord;
            }
            if(uData.length > 0){
                for(let i in uData){
                    for(let n in modelHandle.value){
                        uData[n] = modelHandle.value[n]
                    }
                }
            }
            _data['changedRows'] = uData.length
        }
        return _data;
    }

    public count(modelHandle: ModelHandle):number{
        if(modelHandle.where){
            let _data = this.mockRecord.filter((item:any)=>{
                return MockModel.where(item, modelHandle.where);
            });
            return _data.length;
        }
        return this.mockRecord.length;
    }

    public static where(item: any, where: any[]):boolean{
        return true
    }
}

export class BaseModel{

    protected mysql: Mysql;
    protected app: App;
    private mock: boolean;
    protected mockData: any[];
    protected key: any;

    public constructor(app: App){
        this.app = app;
        this.mysql = app.mysql();
        this.mock = process.env.DATE_MODE = "mock" ? true : false;
    }

    public static getTime():number{
        let _time: number = new Date().getTime();
        _time = Math.ceil(_time/1000);
        return _time;
    }

    protected exec(sql: string):Promise<any>{
        console.log(sql);
        if(this.mock){
            return Promise.resolve(new MockModel(this.mockData).exec(sql));
        }
        return this.mysql.promise(sql);
    }

    protected handle(modelHandle: ModelHandle):Promise<any>{
        let sql = "";
        let error:any = null;
        if(modelHandle.add){
            if(!modelHandle.value && !modelHandle.field) error = "[DB] INSERT SQL value and field not empty";
            sql = `INSERT INTO ${modelHandle.tableName} ${this._addValue(modelHandle.value, modelHandle.field)}`;
        }else if(modelHandle.select){
            if(!modelHandle.where) error = "[DB] SELECT SQL where not empty";
            modelHandle.limit = modelHandle.limit ? `LIMIT ${modelHandle.limit}` : "";
            modelHandle.order = modelHandle.order ? `ORDER BY ${modelHandle.order}` : "";
            sql = `SELECT ${this._field(modelHandle.field)} FROM ${modelHandle.tableName} WHERE ${this._where(modelHandle.where)} ${modelHandle.order} ${modelHandle.limit}`;
        }else if(modelHandle.update){
            if(!modelHandle.where || !modelHandle.value) error = "[DB] UPDATE SQL where or value not empty";
            sql = `UPDATE ${modelHandle.tableName} SET ${this._setValue(modelHandle.value, modelHandle.field)} WHERE ${this._where(modelHandle.where)}`;
        }else{
            error = "[DB] SQL TYPE not empty"
        }
        if(error) return Promise.reject(new Error(`${error} ERROR SQL: ${sql}`));

        if(this.mock){
            return Promise.resolve(new MockModel(this.mockData).handle(modelHandle));
        }

        return this.exec(sql);
    }

    protected count(modelHandle: ModelHandle):Promise<number>{
        let error:any = null;
        if(!modelHandle.where) error = "[DB] SELECT COUNT SQL where not empty";
        let sql = `SELECT COUNT(*) FROM ${modelHandle.tableName} WHERE ${this._where(modelHandle.where)}`;
        if(error) return Promise.reject(new Error(`${error} ERROR SQL: ${sql}`));

        if(this.mock){
            return Promise.resolve(new MockModel(this.mockData).count(modelHandle));
        }

        return this.exec(sql).then((result:any)=>{return result[0]["COUNT(*)"]});
    }

    private _v(v:any){
        let _v:any = "''";
        if(typeof v === "string"){
            _v = `'${v}'`;
        }else if(typeof v === "number"){
            _v = v;
        }
        return _v;
    }

    private _f(f:any){
        return `\`${f}\``;
    }

    private _addValue(value:any={}, field:string[]=[]):string{
        let tmp:any[] = [];
        let fieldTmp:any[] = [];
        if(field.length>0){
            for(let i in field){
                let v = value[field[i]] !== "undefined" ? true : false;
                if (v){
                    fieldTmp.push(this._f(field[i]));
                    tmp.push(this._v(value[field[i]]));
                }
            }
        }else{
            for(let i in value){
                fieldTmp.push(this._f(i));
                tmp.push(this._v(value[i]));
            }
        }
        return `(${fieldTmp.join(",")}) VALUES (${tmp.join(",")})`;
    }

    private _setValue(value:any={}, field:string[]=[]):string{
        let tmp:any[] = [];
        if(field.length>0){
            for(let i in field){
                let v = value[field[i]] !== "undefined" ? true : false;
                if (v){
                    tmp.push(`${this._f(field[i])}=${this._v(value[field[i]])}`);
                }
            }
        }else{
            for(let i in value){
                tmp.push(`${this._f(i)}=${this._v(value[i])}`);
            }
        }
        return tmp.join(",");
    }

    private _field(field:any[]=[]):string{
        for(let i in field){
            field[i] = this._f(field[i])
        }
        return field.length>0 ? field.join(",") : "*";
    }

    private _where(where:any[]=[]):string{
        let tmp:any[] = [];
        for(let i in where){
            if(typeof where[i] === "string"){
                tmp.push(where[i]);
            }else if(typeof where[i] === "object"){
                if(where[i][1] == "in"){
                    tmp.push(`${this._f(where[i][0])} ${where[i][1]} (${where[i][2]})`);
                }else{
                    tmp.push(`${this._f(where[i][0])} ${where[i][1]} ${this._v(where[i][2])}`);
                }
            }
        }
        return tmp.join(" AND ");
    }

}