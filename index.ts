#!/usr/bin/env node
/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="./typings/commander/commander.d.ts" />

import * as program from "commander";
import CoreApp from "./core/App";
import * as fs from "fs";

function daemon() {
    let new_argv: string[] = [];
    for (let i = 1; i<process.argv.length; i++) {
        let arg = process.argv[i];
        if (arg !== "-D" && arg !== "daemon") {
            new_argv.push(process.argv[i]);
        }
    }
    let d = require("child_process").spawn(process.argv[0], new_argv, {
        detached: true,
        stdio: ["ignore", "ignore", "ignore"]
    });
    d.unref();
    d.on("error", function (code: number, signal: string){
        d.kill(signal);
        d = require("child_process").spawn(process.argv[0], new_argv);
    });
    d.on("exit", function(code: number) {
        console.log("exit");
    });
}

function init(dev:boolean, callBack:()=>void){
    let new_argv: string[] = [];
    new_argv.push("init");
    if (dev) new_argv.push("-d");
    let spawn = require("child_process").spawn;
    let init = spawn("./node_modules/gulp/bin/gulp.js", new_argv);
    init.stdout.on('data', (data:string) => {
        console.log(data.toString());
    });

    init.stderr.on('data', (data:string) => {
        console.log(data.toString());
    });
    init.on('exit', (code:string, signal: string) => {
        if(code != "0"){
            init.kill(signal);
        }else{
            if(dev){
                let webpack_server = spawn("./node_modules/gulp/bin/gulp.js", ["webpack-dev-server"]);
                console.log("webpack_server start");
            }
            callBack();
        }
    });
}

/* 基本设置 */
program
    .version(fs.readFileSync("VERSION").toString());

/* 启动Data服务 */
program
    .command("start <instance>")
    .description("start service")
    .option("-D --daemon", "run in backend")
    .option("-d --dev", "dev model")
    .option("-m --mock", "mock model")
    .action(function(instance: any, options: any){
        if (options.daemon) {
            return daemon();
        }
        let __DEV__ = false;
        let __MOCK__ = false;

        if(options.dev){
            __DEV__ = true;
        }
        if(options.mock){
            __MOCK__ = true;
        }
        if(instance !== "core") return;
        init(__DEV__, ()=>{
            let core: CoreApp = new CoreApp;
            if(__DEV__) core.openDev();
            if(__MOCK__) core.openMock();
            core.start();
        })
    }).on("--help", function(){
    console.log("  Examples:");
    console.log("");
    console.log("    $ start core : start Core Service");
});


/* 捕获所有命令,输出帮助信息 */
program
    .command("*")
    .action(function(options: any){
        program.help();
    });

program.parse(process.argv);

// 如果没有任何参数则直接输出帮助
if (process.argv.length <= 2) {
    program.help();
}
