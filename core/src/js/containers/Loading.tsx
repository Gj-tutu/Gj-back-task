/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../libs/ts/material-ui.d.ts" />

import * as React from "react";
import * as classNames from "classnames";
import CircularProgress = require('material-ui/lib/circular-progress');
import Dialog = require('material-ui/lib/dialog');

interface LoadingProp {
    loading: boolean;
}

class Loading extends React.Component<LoadingProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render () {
        let dialogOpen = false;
        if(this.props.loading) dialogOpen = true;
        return (
            <div>
                <Dialog
                    contentStyle={{width:118, height:118}}
                    bodyStyle={{backgroundColor: "#333", opacity: 0.5, borderRadius: 20, position: "absolute"}}
                    open={dialogOpen}
                    overlayStyle={{backgroundColor: "none"}}
                >
                    <CircularProgress/>
                </Dialog>
            </div>
        );
    }
}
export default Loading
