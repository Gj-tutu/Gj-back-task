/**
 * Created by tutu on 16-3-25.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../libs/ts/material-ui.d.ts" />

import * as React from "react";
import {Playbook} from "../../../model/playbook";
import {Setting} from "../../../playbook/Base";

interface PlaybookProp {
    setting: Setting;
    action: any;
    id?: number;
    playbook?: Playbook;
}

class Base extends React.Component<PlaybookProp, any> {

    constructor(props: PlaybookProp, context: any) {
        super(props, context);
    }

    public componentDidMount() {
        if(this.props.id && !this.props.playbook){
            this.props.action.get(this.props.id);
        }
    }

    public componentWillUnmount() {
    }

    public render () {
        return (
            <div>出错啦!!</div>
        );
    }
}
export default Base;
