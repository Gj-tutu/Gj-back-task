/**
 * Created by tutu on 16-3-25.
 */

import {Base, Script, ScriptResult} from "./Base";
import CoreApp from "../App";
import {Playbook} from "../model/playbook";
import * as Constant from "../Constant";

export default class Demo extends Base{

    protected name: string = "demo1";
    protected scripts: any = {name: "test"};

    constructor(app:CoreApp, playbook?: Playbook){
        super(app, playbook);
        this.setHandleFun(Demo.demoHandle);
        this.init();
    }

    private static demoHandle(script:Script):Promise<ScriptResult>{
        let result:ScriptResult = {
            resultState: Constant.NORMAL,
            command: Constant.SCRIPT_NEXT_COMMAND,
            data: {}
        };
        return new Promise((resolve : (value?: any) => void, reject: (error?: any) => void)=>{
            if(script.getName() == "test"){
                setTimeout(()=>{
                    result.data = "脚本执行成功";
                    resolve(result);
                }, 1000*30);
            }else{
                reject(new Error("脚本为空"));
            }
        });
    }
}