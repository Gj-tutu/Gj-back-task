/**
 * Created by tutu on 16-2-2.
 */

/// <reference path="../../typings/nodemailer/nodemailer.d.ts" />
/// <reference path="../../typings/nodemailer/nodemailer-types.d.ts" />
import App from "../App";
import {createTransport, Transporter, SendMailOptions, SentMessageInfo} from "nodemailer";
import {Promise} from "./Promise";

export class Email{
    private conf:Config;
    constructor(conf: Config){
        this.conf = conf;
    }

    /**
     * 发送邮件
     * @param subject
     * @param body
     * @param to
     * @param cc
     * @param bcc
     * @returns {Promise}
     */
    public send(subject:string, body:string, to:string[], cc?:string[], bcc?:string[]){
        let connect = this.connect();
        let self = this;
        return new Promise((resolve, reject) => {
            connect.sendMail({
                from:self.conf.from,
                sender:self.conf.sender,
                to: to,
                cc: cc,
                bcc: bcc,
                subject: subject,
                html: body,
                encoding: 'utf-8'
            }, function(err:Error, info:SentMessageInfo):void{
                if(err)
                    reject(err);
                else{
                    resolve(info);
                }
            });
        });

    }

    private connect():Transporter{
        return createTransport({
            host: this.conf.host,
            port: this.conf.port,
            secure: this.conf.secure,
            auth: {
                user: this.conf.user,
                pass: this.conf.pass
            }
        });
    }
}

export interface Config {
    /**
     * The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>', see here for details
     */
    from?: string;
    /**
     * An e-mail address that will appear on the Sender: field
     */
    sender?: string;
    /**
     * is the port to connect to (defaults to 25 or 465)
     */
    port?: number;
    /**
     * is the hostname or IP address to connect to (defaults to 'localhost')
     */
    host?: string;
    /**
     * defines if the connection should use SSL (if true) or not (if false)
     */
    secure?: boolean;
    /**
     * optional hostname of the client, used for identifying to the server
     */
    name?: string;
    user?: string;
    pass?: string;
}
export function connect(config: Config, app: App){

    return new Email(config);
}