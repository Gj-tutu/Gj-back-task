/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../libs/ts/material-ui.d.ts" />
/// <reference path="../../../../typings/classnames/classnames.d.ts" />

import * as React from "react";
import * as classNames from "classnames";
import Platform from "../../../../app/tools/Platform";
import LeftNav = require('material-ui/lib/left-nav');
import MenuItem = require('material-ui/lib/menus/menu-item');
import Menu = require('material-ui/lib/menus/menu');
import RaisedButton = require('material-ui/lib/raised-button');
import {playbookData} from "../reducers/PlayBook";

interface LeftProp {
    show?: boolean;
    mainAction?: any;
    playbookAction?: any;
    playbook: playbookData;
}

class Left extends React.Component<LeftProp, any> {

    constructor(props: any, context: any) {
        super(props);
    }

    private updateList(){
        this.props.playbookAction.typeList();
    }

    public componentDidMount() {
        this.updateList();
    }

    public render() {
        let open = true;
        let style = {zIndex: 4, paddingTop: 64};
        let width = 300;
        let docked = true;
        if(Platform.getPlatform().isMobile()){
            width = 400;
            style.zIndex = 1201;
            style.paddingTop = 0;
            docked = false;
            open = this.props.show;
        }
        return (
            <div>
                <LeftNav
                    docked={docked}
                    width={width}
                    style={style}
                    open={open}
                    onRequestChange={this.props.mainAction.leftShow}
                ><Menu onChange={this.__click.bind(this)}
                       autoWidth={false} width={width}>
                    <MenuItem checked={this.props.playbook.type == "all"} value="all" key={-1}>全部</MenuItem>
                    {this.props.playbook.typeList.map((row: any, index: number)=>{
                        let checked = this.props.playbook.type == this.props.playbook.typeMap[row]["name"] ? true : false;
                        return (<MenuItem checked={checked} value={row} key={index}>
                            {this.props.playbook.typeMap[row]["title"]}
                        </MenuItem>)
                        })}
                </Menu>
                </LeftNav>
            </div>
        );
    }

    private __click(event: any, value: any){
        this.props.mainAction.leftShow();
        this.props.playbookAction.selectType(value);
    }
}

export default Left;