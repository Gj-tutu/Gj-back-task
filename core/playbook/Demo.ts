/**
 * Created by tutu on 16-3-25.
 */

import {Base, Script, ScriptResult} from "./Base";
import CoreApp from "../App";
import {Playbook} from "../model/playbook";
import * as Constant from "../Constant";
import {Setting} from "./Base";
import {formatDate} from "../../app/tools/Util";

export const setting: Setting = {name: "demo", title: "demo", auto: false};

export default class Demo extends Base{

    protected scripts: any = {name: "test"};

    protected name:string = setting.name;

    constructor(app:CoreApp, playbook?: Playbook){
        super(app, playbook);
        this.setHandleFun(this.demoHandle);
        this.init();
    }

    private demoHandle(script: Script):Promise<ScriptResult>{
        let result:ScriptResult = {
            resultState: Constant.NORMAL,
            command: Constant.SCRIPT_NEXT_COMMAND,
            data: {}
        };
        return new Promise((resolve : (value?: any) => void, reject: (error?: any) => void)=>{
            if(script.getName() == "test"){
                let startTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
                setTimeout(()=>{
                    let endTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
                    result.data = `脚本开始时间:${startTime}, 脚本结束时间:${endTime}.`;
                    resolve(result);
                }, this.getParam("waitTime")*1000);
            }else{
                reject(new Error("脚本为空"));
            }
        });
    }
}