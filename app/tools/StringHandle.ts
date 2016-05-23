/**
 * Created by tutu on 16-2-24.
 */

/// <reference path="../../typings/node/node.d.ts" />

import * as crypto from "crypto";

export function md5(str: string) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

export function uuid():string{
    let randMath = function(){
            var b = new Array(16);
            for (var i = 0, r = 0; i < 16; i++) {
                if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
                b[i] = r >>> ((i & 0x03) << 3) & 0xff;
            }
            return b;
        },
        uuidParse = function(buf:any, offset?:number){
            let _byteToHex:any[] = [];
            let _hexToByte:{[key: string]: any} = {};
            for (var i = 0; i < 256; i++) {
                _byteToHex[i] = (i + 0x100).toString(16).substr(1);
                _hexToByte[_byteToHex[i]] = i;
            }
            var i:number = offset || 0, bth = _byteToHex;
            return  bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]];
        },
        uuid = function(){
            var rnds = randMath();
            rnds[6] = (rnds[6] & 0x0f) | 0x40;
            rnds[8] = (rnds[8] & 0x3f) | 0x80;
            return uuidParse(rnds);
        };
    return uuid();
}