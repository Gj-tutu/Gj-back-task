/**
 * Created by tutu on 15-12-22.
 */

/// <reference path="../../libs/ts/react-tap-event-plugin.d.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-dom.d.ts" />
/// <reference path="../../libs/ts/common.d.ts" />

/// material-ui 目前版本使用前需要先注入这个插件
import injectTapEventPlugin = require("react-tap-event-plugin");

import * as ReactDom from "react-dom";
import * as React from "react";
import Container from "./js/containers/Container";

injectTapEventPlugin();
class Index {
    public static init(): void {
        let data:any = window._data || {};
        ReactDom.render(<Container data={data}/>, document.getElementById("container"));
    }
}

Index.init();

