/**
 * Created by tutu on 16-3-25.
 */

export class Time extends Date{

    private _timeStamp:number = 0;
    private _dateDetail:number[] = [];

    public getTimeStamp():number{
        if(this._timeStamp == 0){
            this._timeStamp = Math.ceil(this.getTime()/1000);
        }
        return this._timeStamp;
    }

    public foramt(fmt: string):string{
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
    }

    public getDateDetail():number[]{
        if(this._dateDetail.length <= 0){
            this._dateDetail = [this.getMinutes(), this.getHours(), this.getDate(), this.getMonth(), this.getDay()]
        }
        return this._dateDetail;
    }

    public judge(date: string):boolean{
        let _date = this.getDateDetail();
        let __date:any[] = date.split(" ");
        for(let i=0;i<5;i++){
            if(__date[i] == "*"){
                continue
            }
            if(__date[i] == _date[i]){
                continue
            }
            if(__date[i].indexOf("/") > 0){
                let tmp: any[] = __date[i].split("/");
                if(tmp[0] == "*" && _date[i] % tmp[1] == 0){
                    continue
                }
            }
            return false
        }
        return true
    }
}