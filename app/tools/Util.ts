/**
 * Created by tutu on 16-3-25.
 */

//TODO 深度判断
export function inArray(item:any, array:any[]):boolean{
    for(let i in array){
        if(item == array[i]) return true
    }
    return false
}
