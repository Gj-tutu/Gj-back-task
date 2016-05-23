/**
 * Created by tutu on 16-3-25.
 */

export function getTime():number{
    let _time: number = new Date().getTime();
    _time = Math.ceil(_time/1000);
    return _time;
}