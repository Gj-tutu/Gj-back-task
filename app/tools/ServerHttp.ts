/**
 * Created by tutu on 15-12-22.
 */

/// <reference path="../../libs/ts/request.d.ts" />

import * as request from 'request';
import {Promise} from "./Promise";

export default class ServerHttp {

    public static setData(type: string, header: any, url: string, data: any):Promise<any>{
        return new Promise((resolve, reject) => {
            let options = {
                method: type,
                url: url,
                headers: header,
                json: true,
                body: data
            };
            request(options, (error, response, body)=>{
                if(error){
                    throw error;
                }else{
                    resolve(body);
                }
            });
        });
    }
}

