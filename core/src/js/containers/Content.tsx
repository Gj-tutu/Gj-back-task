/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../libs/ts/material-ui.d.ts" />

import * as React from "react";
import Table = require('material-ui/lib/table/table');
import TableHeaderColumn = require('material-ui/lib/table/table-header-column');
import TableRow = require('material-ui/lib/table/table-row');
import TableHeader = require('material-ui/lib/table/table-header');
import TableRowColumn = require('material-ui/lib/table/table-row-column');
import TableBody = require('material-ui/lib/table/table-body');
import Dialog = require('material-ui/lib/dialog');
import RaisedButton = require('material-ui/lib/raised-button');
import Platform from "../../../../app/tools/Platform";
import PlaybookFactory from "./PlaybookFactory";
import {playbookData} from "../reducers/PlayBook";


interface ContentProp {
    playbook: playbookData;
    mainAction: any;
    playbookAction: any;
    id?: number;
    type?: string;
}

class Content extends React.Component<ContentProp, any> {

    private _updateTime: any = null;
    private typeFlag: any = {};
    private _component = false;

    constructor(props: any, context: any) {
        super(props);
    }

    private updateList(){
        this.props.playbookAction.list(100, 0);
    }

    public componentDidMount() {
        this._updateTime = setTimeout(this.updateList.bind(this), 1000*30);
        this._component = true;
    }

    public componentWillUnmount() {
        clearTimeout(this._updateTime);
        this._component = false;
    }

    private updateTypeList(){
        if(this._component && this.props.playbook.type != "all"){
            if(!this.typeFlag[this.props.playbook.type]){
                this.props.playbookAction.list(100, 0, this.props.playbook.type);
                this.typeFlag[this.props.playbook.type] = true;
            }
        }
    }

    render() {
        this.updateTypeList();
        let dialogOpen = false;
        if(this.props.id) dialogOpen = true;
        if(this.props.type) dialogOpen = true;
        let style = {paddingLeft: 300, paddingTop: 64};
        if(Platform.getPlatform().isMobile()){
            style.paddingLeft = 0;
        }
        return (
            <div style={style}>
                {this.props.playbook.type != "all" ? this.props.playbook.typeMap[this.props.playbook.type]["auto"] ? "" :
                <RaisedButton label="添加" fullWidth={true} primary={true} onTouchTap={this.__add.bind(this)} /> : ""}
                <Dialog
                    modal={false}
                    open={dialogOpen}
                    onRequestClose={this.__close.bind(this)}>
                    <PlaybookFactory
                        type={this.props.type}
                        id={this.props.id}
                        playbook={this.props.playbook}
                        playbookAction={this.props.playbookAction}>
                    </PlaybookFactory>
                </Dialog>
                <Table onCellClick={this.__click.bind(this)}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
                            <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
                            <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
                            <TableHeaderColumn tooltip="The Time">Time</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                        {this.props.playbook.showList.map( (row: any, index: number) => (
                        <TableRow key={this.props.playbook.map[row].id} selectable={true}>
                            <TableRowColumn>{this.props.playbook.map[row].id}</TableRowColumn>
                            <TableRowColumn>{this.props.playbook.map[row].type}</TableRowColumn>
                            <TableRowColumn>{this.props.playbook.map[row].state}</TableRowColumn>
                            <TableRowColumn>{this.props.playbook.map[row].update_time}</TableRowColumn>
                        </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    private __close(){
        this.props.mainAction.router("/");
    }

    private __click(row: number, cell: number){
        this.props.mainAction.router("/checkPlaybook/"+this.props.playbook.showList[row]);
    }

    private __add(){
        this.props.mainAction.router("/addPlaybook/"+this.props.playbook.type);
    }
}

export default Content;