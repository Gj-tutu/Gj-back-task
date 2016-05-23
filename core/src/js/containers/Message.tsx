/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../libs/ts/material-ui.d.ts" />

import * as React from "react";
import Snackbar = require('material-ui/lib/snackbar');

interface MessageProp {
    message: string;
    mainAction?: any;
}

class Message extends React.Component<MessageProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render () {
        let MessageOpen = false;
        if(this.props.message) MessageOpen = true;
        return (
            <div>
                <Snackbar
                    open={MessageOpen}
                    message={this.props.message ? this.props.message : "空"}
                    autoHideDuration={3000}
                    onRequestClose={this.__requestClose.bind(this)}
                />
            </div>
        );
    }

    private __requestClose(event: string){
        if(event == "timeout"){
            this.props.mainAction.message();
        }
    }
}
export default Message
