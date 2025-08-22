import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';
import { readFileSync } from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });

import { type TransportOptions } from 'nodemailer';

class Email {
    private user: Record<string, string>;
    private url: string;

    constructor(user: Record<string, string>, url: string) {
        this.user = user;
        this.url = url;
    }
    private newTransport() {
        const transport = nodemailer.createTransport({
            host: process.env.DEV_MAIL_HOST,
            port: process.env.DEV_MAIL_PORT,
            auth: {
                user: process.env.DEV_MAIL_USER,
                pass: process.env.DEV_MAIL_PASSWORD,
            },
        } as TransportOptions);
        return transport;
    }
    private async sendMail(template: string, subject: string) {
        const sendOptions = {
            to: this.user.email,
            from: `LogiSick`,
            subject,
            html: template,
            text: convert(template),
        };
        await this.newTransport().sendMail(sendOptions);
    }
    public async sendVerification() {
        const verificationHtml = readFileSync(
            path.join(__dirname, 'emailTemplates', 'verification.html'),
            { encoding: 'utf-8' }
        );
        const options = {
            brand_name: 'LogiSick',
            user_name: this.user.userName,
            otp_code: this.user.otp,
            otp_expire_time: 10,
            support_email : 'ravishranjan2003@gmail.com',
            year: new Date().getFullYear(),
        };
        const template = Handlebars.compile(verificationHtml)(options);
        const subject = `Verify your email`;
        await this.sendMail(template, subject);
    }
}
export default Email;
