/**
 * Created by tutu on 16-3-24.
 */

export interface setting{
    title: string;
    name: string;
    auto: boolean;
    autoTime?: number;
}

export function getTypeMap(){
    return {
        demo: {
            title: "Demo",
            name: "demo",
            auto: false,
            autoTime: 30
        },
        demo1: {
            title: "Demo1",
            name: "demo1",
            auto: false,
            autoTime: 30
        }
    }
}

export function getTypeList(){
    return ["demo", "demo1"]
}