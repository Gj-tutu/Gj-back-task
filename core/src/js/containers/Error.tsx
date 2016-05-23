/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../typings/redux/redux.d.ts" />
/// <reference path="../../../../typings/react-redux/react-redux.d.ts" />

import * as React from "react";

class Error extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render () {
        return (
            <div>
                <h2>该页面不存在</h2>
            </div>
        );
    }
}
export default Error;
