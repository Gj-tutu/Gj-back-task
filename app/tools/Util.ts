/**
 * Created by tutu on 16-3-25.
 */

export function getTime():number{
    let _time: number = new Date().getTime();
    _time = Math.ceil(_time/1000);
    return _time;
}


//TODO 深度判断
export function inArray(item:any, array:any[]):boolean{
    for(let i in array){
        if(item == array[i]) return true
    }
    return false
}

export function formatDate(date: Date, fmt: string):string { //author: meizz
    var o: any = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export function dateDetail(date: Date){
    return [date.getMinutes(), date.getHours(), date.getDate(), date.getMonth(), date.getDay()]
}

export function isNowDate(nowDate: any[], date: any[]){
    for(let i=0;i<5;i++){
        if(date[i] == "*"){
            continue
        }
        if(date[i] == nowDate[i]){
            continue
        }
        if(date[i].indexOf("/") > 0){
            let tmp: any[] = date[i].split("/");
            if(tmp[0] == "*" && nowDate[i] % tmp[1] == 0){
                continue
            }
        }
        return false
    }
    return true
}