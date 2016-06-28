/**
 * Created by tutu on 16-3-25.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../libs/ts/material-ui.d.ts" />

import * as React from "react";
import Base from "./Base";
import FlatButton = require('material-ui/lib/flat-button');
import TextField = require('material-ui/lib/text-field');
import * as Constant from "../../../Constant";

class Demo extends Base {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render () {
        if(this.props.id){
            return (
                <div>
                    {this.props.playbook.result["test"] ? this.props.playbook.result["test"] : "执行中"}
                </div>
            );
        }else{
            return (
                <div>
                    <TextField
                        hintText="30"
                        floatingLabelText="脚本执行时间"
                        type="text"
                        onChange={this.__param.bind(this)}
                    />
                    <FlatButton label="添加" primary={true}
                                onTouchTap={this.__add.bind(this)}/>
                </div>
            );
        }
    }

    private __param(event: any){
        this.setState({waitTime: event.target.value})
    }

    private __add(){
        this.props.action.add(this.props.setting.name, {waitTime: this.state.waitTime});
    }
}

export default Demo
