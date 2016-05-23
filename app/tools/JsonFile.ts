/**
 * Created by tutu on 15-12-30.
 */

/// <reference path="../../typings/node/node.d.ts" />

class JsonFile {
    public static read(fileName: string): any {
        return require(fileName);
    }
}

export default JsonFile
