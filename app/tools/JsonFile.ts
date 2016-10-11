/**
 * Created by tutu on 15-12-30.
 */

/// <reference path="../../typings/node/node.d.ts" />

class JsonFile {
    public static read(filePath: string): any {
        return require(filePath);
    }
}

export default JsonFile
