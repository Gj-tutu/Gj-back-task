/**
 * Created by tutu on 16-3-25.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../libs/ts/material-ui.d.ts" />

import * as React from "react";
import Base from "./Base";
import FlatButton = require('material-ui/lib/flat-button');
import * as Constant from "../../../Constant";

class Demo extends Base {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render () {
        if(this.props.id){
            return (
                <div>
                    {JSON.stringify(this.props.playbook.result)}
                </div>
            );
        }else{
            return (
                <div>
                    {this.props.setting.title}
                    <FlatButton label="添加" primary={true}
                                onTouchTap={this.__add.bind(this)}/>
                </div>
            );
        }
    }

    private __add(){
        this.props.action.add(this.props.setting.name, {value: this.props.setting.name});
    }
}

export default Demo
