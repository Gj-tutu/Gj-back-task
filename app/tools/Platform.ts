/**
 * Created by tutu on 15-12-22.
 */

export default class Platform {

    private static platform: Platform;
    private pc: boolean;
    private mobile: boolean;
    private android: boolean;
    private ios: boolean;
    private server: boolean;

    constructor() {
        this.init()
    }

    public static getPlatform() {
        if(!this.platform){
            this.platform = new Platform();
        }
        return this.platform;
    }

    private static checkOs(str: string, osList: string[]){
        if (!str || !osList || osList.length <= 0) return false;
        for(var i in osList){
            if(str.indexOf(i) > -1) return true;
        }
        return false;
    }

    public init() {
        this.pc = false;
        this.mobile = false;
        this.android = false;
        this.ios = false;
        this.server = false;
        let userAgent = navigator.userAgent;
        if(typeof window == "object"){
            if(window.document.body.clientWidth > 800){
                this.pc = true;
            }else{
                this.mobile = true;
            }
            if(this.mobile && Platform.checkOs(userAgent,["iphone", "ipad", "ipod"])){
                this.ios = true;
            }else if(this.mobile && Platform.checkOs(userAgent,["android"])){
                this.android = true;
            }
        }else{
            this.server = true;
        }
    }

    public isPC() {
        return this.pc;
    }

    public isMobile(){
        return this.mobile;
    }

    public isServer(){
        return this.server;
    }

    public isAndroid(){
        return this.android;
    }

    public isIos(){
        return this.ios;
    }
}

