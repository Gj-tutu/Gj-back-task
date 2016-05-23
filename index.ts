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
        if (arg !== "-d" && arg !== "daemon") {
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
/* 基本设置 */
program
    .version(fs.readFileSync("VERSION").toString());

/* 启动Data服务 */
program
    .command("start <instance>")
    .description("start service [data|core|all]")
    .option("-d, --daemon", "run in backend")
    .action(function(instance: any, options: any){
        if (options.d) {
            return daemon();
        }
        if (instance === "core" || instance === "all") {
            let core: CoreApp = new CoreApp;
            core.start();
        }
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
