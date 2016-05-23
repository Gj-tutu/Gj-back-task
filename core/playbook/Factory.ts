/**
 * Created by tutu on 16-3-23.
 */

import App from "../../app/App";
import {getTypeMap, getTypeList} from "./Config";
import {Base as BasePlayBook} from "./Base";

export class Factory{
    private static playbookTypeListMap: any = null;
    private static playbookTypeSettingMap: any = null;
    private static playbookTypeList: string[] = [];

    private static findPlaybook(){
        Factory.playbookTypeListMap = {};
        Factory.playbookTypeSettingMap = getTypeMap();
        Factory.playbookTypeList = getTypeList();
        for(let i in Factory.playbookTypeList){
            let typeName = Factory.playbookTypeList[i].replace(/(\w)/,function(v){return v.toUpperCase()});
            Factory.playbookTypeListMap[Factory.playbookTypeList[i]] = require(`./${typeName}`).default;
        }
    }

    public static getPlaybook(typeName:string):any{
        if(!Factory.playbookTypeListMap){
            Factory.findPlaybook();
        }
        if(!Factory.playbookTypeListMap[typeName]) return null;
        return Factory.playbookTypeListMap[typeName];
    }

    public static getPlaybookSettingMap(){
        if(!Factory.playbookTypeSettingMap){
            Factory.findPlaybook();
        }
        return Factory.playbookTypeSettingMap;
    }

    public static getPlaybookSetting(typeName:string):any{
        if(!Factory.playbookTypeSettingMap){
            Factory.findPlaybook();
        }
        if(!Factory.playbookTypeSettingMap[typeName]) return null;
        return Factory.playbookTypeSettingMap[typeName];
    }

    public static getPlaybookTypeList():string[]{
        if(Factory.playbookTypeList.length <= 0){
            Factory.findPlaybook();
        }
        return Factory.playbookTypeList;
    }

    public static isHasPlaybook(typeName:string):boolean{
        if(Factory.playbookTypeList.length <= 0){
            Factory.findPlaybook();
        }
        return Factory.playbookTypeList.indexOf(typeName) >= 0 ? true : false;
    }
}