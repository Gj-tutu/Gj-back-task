/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../typings/express/express.d.ts" />

import * as express from "express";
import jsonFile from "./tools/JsonFile";
import {create as createLogger, middle as loggerMiddle} from "./tools/Log";
import {Mysql, connect as connectMysql} from "./tools/Mysql";
import {Redis, connect as connectRedis} from "./tools/Redis";
import {Email, connect as connectEmail} from "./tools/Email";

const config = jsonFile.read("app/config");

class App {

    public express: express.Application;
    protected name: string;
    public logger: any;
    public config: any;

    constructor() {
        this.express = express();
        this.config = config;
    }

    /**
     * 生命周期:初始化
     */
    protected init(): void {

    }

    /**
     * 生命周期:结束
     */
    protected exit(): void{

    }

    /**
     * 启动一个应用,开启生命周期
     */
    public start(): void {
        this.express.set("app", this);
        this.express.set("name", this.name);
        this.logger = createLogger(this.express, config.DEBUG);

        this.init();
        this.express.use(loggerMiddle(this.logger));
        this.errorHandle();
        this.closeHandle();
    }

    /**
     * 获取mysql服务,单例模式
     * @returns Mysql
     */
    public mysql() :Mysql{
        return this.make("mysql", function(config:any, app:App){
            return connectMysql(config, app);
        });
    }

    /**
     * 获取redis服务,单例模式
     * @returns Redis
     */
    public redis() :Redis{
        return this.make("redis", function(config:any, app:App){
            return connectRedis(config, app);
        });
    }

    /**
     * 获取email服务,单例模式
     * @returns Redis
     */
    public email() :Email{
        return this.make("email", function(config:any, app:App){
            return connectEmail(config, app);
        })
    }


    /**
     * 单例服务生成器
     * @param serviceName
     * @param builder
     * @returns {*}
     */
    protected make(serviceName: string, builder: (config:any, app:App)=>any){
        let service = this.express.get(serviceName);
        if(service){
            return service;
        }
        service = builder(this.config.SERVICE[serviceName], this);
        this.express.set(serviceName, service);
        return service;
    }

    /**
     * 监听端口启动服务
     * @param port
     */
    protected listen(port: number) {
        let self = this;
        this.express.listen(port, function(){
            self.logger.info(self.name, "listen port:", port);
        });
    }

    /**
     * 错误处理handle
     */
    protected errorHandle(): void {
        var self = this;
        this.express.use(function(req: express.Request, res: express.Response, next: any){
            res.status(404).send("Sorry cant find that!");
        });
        this.express.use(function(err: Error, req: express.Request, res: express.Response, next: any){
            self.logger.error(err);
            res.status(500).send("Something broke!");
        });
    }

    /**
     * 推出handle
     */
    protected closeHandle(): void {
        var self = this;
        process.on('exit', function () {
            self.logger.info(self.name, 'exiting');
            self.exit();
        });
    }
}

export default App



