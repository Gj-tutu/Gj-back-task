/**
 * Created by tutu on 16-3-25.
 */


declare interface Date {
    getTimeStamp(): number;
    format(fmt: string): string;
    getDetail(): number[];
    judge(str: string): boolean;
    validate(str: any, time: number): boolean;
}

Date.prototype.getTimeStamp = function(){
    if(this._timeStamp != 'undefined'){
        this._timeStamp = Math.ceil(this.getTime()/1000);
    }
    return this._timeStamp;
};
Date.prototype.format = function(fmt:string){
    var o: any = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Date.prototype.getDetail = function(){
    if(this._dateDetail != "undefined"){
        this._dateDetail = [this.getMinutes(), this.getHours(), this.getDate(), this.getMonth(), this.getDay()]
    }
    return this._dateDetail;
};
Date.prototype.judge = function(date: string){
    let _date = this.getDetail();
    let __date:any[] = date.split(" ");
    for(let i=0;i<5;i++){
        if(!this.validate(__date[i], _date[i])) return false;
    }
    return true
};
Date.prototype.validate = function(str: any, time: number){
    if(str == "*"){
        return true
    }
    if(str == time){
        return true
    }
    if(str.indexOf(",") > 0){
        let tmp: any[] = str.split(",");
        for(let i=0;i<tmp.length;i++){
            if(this.validate(tmp[i], time)) return true;
        }
        return false;
    }
    if(str.indexOf("-") > 0){
        let tmp: any[] = str.split("-");
        for(let i=tmp[0];i<=tmp[1];i++){
            if(this.validate(tmp[i], time)) return true;
        }
        return false;
    }
    if(str.indexOf("/") > 0){
        let tmp: any[] = str.split("/");
        if(tmp[0] == "*" && time % tmp[1] == 0){
            return true
        }
    }
    return false
};
