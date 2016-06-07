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