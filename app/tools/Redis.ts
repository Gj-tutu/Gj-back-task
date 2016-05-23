/**
 * Created by tutu on 16-1-20.
 */

/// <reference path="../../typings/redis/redis.d.ts" />
import App from "../App";
import * as redis from "redis";
import {ResCallbackT} from "redis";
export class Redis{
    protected connect: redis.RedisClient;
    protected config:Config;
    constructor(config: Config) {
        let options: redis.ClientOpts = {};
        if(config.password){
            options['auth_pass'] = config.password;
        }
        this.config = config;
        this.connect = redis.createClient(this.config.port, this.config.host, options);

    }

    /**
     * 在真实执行时调用该接口获取可用连接
     * @returns {redis.RedisClient}
     */
    public instance() :redis.RedisClient {
        return this.connect;
    }

    /**
     * 建立一个新链接,零时链接,需要自我关闭
     * @returns {RedisClient}
     */
    public newInstance(options?: redis.ClientOpts) :redis.RedisClient {
        if(this.config.password){
            options['auth_pass'] = this.config.password;
        }
        return redis.createClient(this.config.port, this.config.host, options);
    }
}

export interface Config {
    /**
     * The hostname of the database you are connecting to. (Default: localhost)
     */
    host?: string;

    /**
     * The port number to connect to.
     */
    port?: number;
    /**
     * The password of that Auth
     */
    password?: string;

    /**
     * Name of the database to use for this connection
     */
    database?: number;
}
export function connect(config: Config, app: App){

    return new Redis(config);
}