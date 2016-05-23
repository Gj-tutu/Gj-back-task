/**
 * Created by tutu on 16-1-8.
 */

/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/bunyan/bunyan.d.ts" />

import * as express from "express";
import * as bunyan from "bunyan";

export function create(app: express.Application, debug: boolean) :bunyan.Logger {
    let level = debug ? bunyan.TRACE : bunyan.INFO,
        name = app.get("name") || "express";

    return bunyan.createLogger({
        name: name,
        streams: [{
            level: level,
            stream: process.stdout
        }],
        serializers: {
            req: bunyan.stdSerializers["req"],
            res: bunyan.stdSerializers["res"],
            err: bunyan.stdSerializers["err"]
        },
        src: debug
    });
}

export function middle(logger: bunyan.Logger) {
    let format_string = ":ip :method :url :status :headers[content-length] "+
        ":referer :userAgent :time ms";
    let format = compile(format_string);
    return function (err: number, req: express.Request, res: express.Response, next: any) {
        let startTime = process.hrtime();

        function logging() {
            let status = res.statusCode,
                method = req.method,
                url = (req.baseUrl || "") + (req.url || "-"),
                referrer = req.header("referer") || req.header("referrer") || "-",
                ua = req.header("user-agent"),
                hrtime = process.hrtime(startTime),
                responseTime = hrtime[0] * 1e3 + hrtime[1] / 1e6,
                ip = req.ip || req.connection.remoteAddress ||
                    (req.socket && req.socket.remoteAddress) ||
                    "127.0.0.1",
                logFn = levelFn(logger, err, status);

            let meta = {
                body: req.body,
                headers: req.headers,
                hrtime: hrtime,
                ip: ip,
                method: method,
                referrer: referrer,
                req: req,
                res: res,
                status: status,
                time: responseTime,
                url: url,
                userAgent: ua
            };

            var json = meta;

            if (!json) {
                logFn.call(logger, format(meta));
            } else {
                logFn.call(logger, json, format(meta));
            }
        }

        res.on("finish", logging);
        res.on("close", logging);

        next(err);
    };
}

function compile(fmt: string) {
    fmt = fmt.replace(/"/g, "\\\"");
    let js = "  return \"" + fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function (_, name, arg) {
        if (arg) {
          return "\"\n + (meta[\"" + name + "\"] ? (meta[\"" + name + "\"][\"" + arg + "\"]||"+
              "(typeof meta[\"" + name + "\"][\"" + arg + "\"] === \"number\"?\"0\": \"-\")) : \"-\") + \"";
        } else {
          return "\"\n    + ((meta[\"" + name + "\"]) || (typeof meta[\"" + name + "\"] === \"number\"?\"0\": \"-\")) + \"";
        }
    }) + "\";";
    return new Function("meta", js);
}


function levelFn(logger: bunyan.Logger, err: number, status: number) {
    if (err || status >= 500) { // server internal error or error
        return logger.error;
    } else if (status >= 400) { // client error
        return logger.warn;
    }
    return logger.info;
}
