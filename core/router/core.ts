/**
 * Created by tutu on 15-12-18.
 */


/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import CoreApp from "../App";
import Dispatch from "../../app/abstract/Dispatch";
import * as Constant from "../Constant";
import User from "../controllers/user";
import Playbook from "../controllers/playbook";


export default function routerHandle(app:CoreApp):express.Router{
    let router: express.Router = express.Router();

    // 全局登录验证
    router.use("/api/*", Dispatch.session(app,['/api/login', '/api/register'], function(session: any){
        let user = session["user"];
        if(typeof user == "object" && user["email"]){
            return Promise.resolve(true);
        }else{
            let error = new Error("need login");
            error.name = Constant.NEED_LOGIN;
            throw error;
        }
    }));

    let user = new User(app);
    let playbook = new Playbook(app);

    //user 登录,注册,登出
    router.post("/api/login", user.handle([{name:"email", form:true}, {name:"password", form:true}], user.login));
    router.post("/api/register", user.handle([{name:"email", form:true}, {name:"password", form:true}], user.register));
    router.post("/api/loginOut", user.handle([], user.loginOut));

    //playbook 查看 状态,列表
    router.get("/api/playbook/get/:id", playbook.handle([{name:"id", param:true}], playbook.get));
    router.get("/api/playbook/list", playbook.handle([{name:"num", query:true}, {name:"start", query:true}, {name:"type", query:true}, {name:"count", query:true}], playbook.list));

    //playbook 操作 添加,删除,重启
    router.post("/api/playbook/add", playbook.handle([{name:"type", form:true}, {name:"param", form:true}], playbook.add));
    router.post("/api/playbook/delete", playbook.handle([{name:"id", form:true}], playbook.delete));

    return router;
};
