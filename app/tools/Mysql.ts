/**
 * Created by tutu on 16-1-20.
 */

/// <reference path="../../typings/mysql/mysql.d.ts" />
import App from "../App";
import * as mysql from "mysql";
import {Promise} from "./Promise";
export class Mysql{
    protected connect: mysql.IPool;
    constructor(config: mysql.IConnectionConfig) {
        this.connect = mysql.createPool(config);
    }

    /**
     * 在真实执行时调用该接口获取可用连接
     * @returns {mysql.IPool}
     */
    public instance():mysql.IPool{
        return this.connect;
    }

    /**
     * 使用promise处理sql返回
     * @param sql
     * @returns {Promise}
     */
    public promise(sql: string):Promise<any>{
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance().query(sql, function(err:Error, result:any[], fields:string[]){
                if(err)
                    reject(err);
                else{
                    resolve(result);
                }
            });
        });
    }
}

export function connect(config: mysql.IConnectionConfig, app: App) :Mysql{
    return new Mysql(config);
}