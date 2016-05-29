#!/usr/bin/env node
/**
 * Created by tutu on 15-12-18.
 */
// 开启Data测试模式
process.env.DATE_MODE = "mock";

import CoreApp from "./core/App";

let core: CoreApp = new CoreApp;
core.start();