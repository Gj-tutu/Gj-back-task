/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import CoreApp from "../App";
import {Record, Model} from "../../app/abstract/Model";
import {md5} from "../../app/tools/StringHandle";
import {ModelHandle} from "../../app/abstract/BaseModel";

export class User extends Record{

    get id(){
        return this.get("id");
    }

    get email(){
        return this.get("email");
    }
    set email(email: string){
        this.set("email", email);
    }

    get state(){
        return this.get("state");
    }
    set state(status: number){
        this.set("state", status);
    }

    get password(){
        return this.get("password");
    }
    set password(password: string){
        this.set("password", password);
    }

    get token(){
        return this.get("token");
    }
    set token(token: string){
        this.set("token", token);
    }
}

export class UserModel extends Model{

    protected tableName = "core_user";

    public key: string = "id";

    private static _mockData: any[] = [];

    public field: string[] = ["id", "email", "password", "state", "token", "create_time", "update_time", "delete_time"];

    public constructor(app: CoreApp){
        super(app);
        this.mockData = UserModel._mockData;
    }

    protected formatData(data: any){
        let record:any = {};
        for(let i in data){
            record[i] = data[i];
        }
        return new User(record);
    }

    private static formatPassword(password: string){
        return md5(md5(password));
    }

    public login(email: string, password: string){
        return this.getUserByName(email, UserModel.formatPassword(password));
    }

    public register(email: string, password: string){
        let user = new User();
        user.email = email;
        user.password = UserModel.formatPassword(password);
        user.state = 1;
        return this.add(user);
    }

    private getUserByName(email: string, password: string){
        let modelHandle: ModelHandle = {
            tableName: this.tableName,
            select: true,
            where: [
                ["email", "=", email],
                ["password", "=", password],
                ["state", "=", 1],
                [this.deleteTime, "<=", 0]
            ]
        };
        return this.handle(modelHandle).then((result: any[])=>{
            if(result.length > 0){
                return this.formatData(result[0]);
            }else{
                throw Error("email or password is error");
            }
        });
    }
}