/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../typings/redux/redux.d.ts" />
/// <reference path="../../../../typings/react-redux/react-redux.d.ts" />

import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {playbookData} from "../reducers/PlayBook";
import Message from "./Message";
import Demo from "../playbook/Demo";
import AutoDemo from "../playbook/AutoDemo";
import Base from "../playbook/Base";

interface AppProp {
    type?: string;
    id?: number;
    playbook: playbookData;
    playbookAction: any;
}

class PlaybookFactory extends React.Component<AppProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        if(!this.props.id && !this.props.type) return (<div></div>);
        if(this.props.id){
            return this.edit(this.props.id);
        }else if(this.props.type){
            return this.add(this.props.type);
        }else{
            return (<div>出错啦!</div>);
        }
    }

    private edit(id: number){
        let playbook = this.getPlaybook(id);
        if(playbook){
            return this.echo(playbook["type"], this.getSetting(playbook["type"]), id, playbook);
        }else{
            return (<div>加载中</div>);
        }
    }

    private add(type: string){
        return this.echo(type, this.getSetting(type));
    }

    private getSetting(type: string){
        return this.props.playbook.typeMap[type];
    }

    private getPlaybook(id: number){
        if(this.props.playbook.map[id]){
            return this.props.playbook.map[id];
        }else{
            return null;
        }
    }

    private echo(type: string, setting:any, id?:number, playbook?:any){
        if(type == "demo"){
            return (<Demo setting={setting} id={id} playbook={playbook} action={this.props.playbookAction}/>)
        }else if(type == "AutoDemo"){
            return (<AutoDemo setting={setting} id={id} playbook={playbook} action={this.props.playbookAction}/>)
        }else{
            return (<Base setting={setting} id={id} playbook={playbook} action={this.props.playbookAction}/>)
        }
    }
}

export default PlaybookFactory
