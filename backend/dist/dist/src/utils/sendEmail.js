"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const html_to_text_1 = require("html-to-text");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const dotenv_1 = __importDefault(require("dotenv"));
// configure the path of config file
dotenv_1.default.config({ path: "config.env" });
// Email handler for the application
class Email {
    user; //contains user's name and email
    url; // any url that should be included in the email to the user
    constructor(user, url) {
        // initialize the variables;
        this.user = user;
        this.url = url;
    }
    newTransport() {
        // create a new transport
        // transport is used to configure the way this application will send email
        const transport = nodemailer_1.default.createTransport({
            host: process.env.NODE_ENV === "production"
                ? process.env.MAIL_HOST
                : process.env.DEV_MAIL_HOST,
            port: process.env.NODE_ENV === "production"
                ? process.env.MAIL_PORT
                : process.env.DEV_MAIL_PORT,
            auth: {
                user: process.env.NODE_ENV === "production"
                    ? process.env.MAIL_USER
                    : process.env.DEV_MAIL_USER,
                pass: process.env.NODE_ENV === "production"
                    ? process.env.MAIL_PASSWORD
                    : process.env.DEV_MAIL_PASSWORD,
            },
        });
        return transport;
    }
    /**
     * @param template, template is the html that the mail will contain
     * @param subject
     */
    async sendMail(template, subject) {
        try {
            const sendOptions = {
                to: this.user.email,
                from: `admin@LogiSick.com`,
                subject,
                html: template,
                text: (0, html_to_text_1.convert)(template),
            };
            await this.newTransport().sendMail(sendOptions);
        }
        catch (_err) {
            console.log(_err);
        }
    }
    /**
     * send email verification mail to the user
     */
    async sendVerification() {
        const verificationHtml = (0, fs_1.readFileSync)(path_1.default.join(__dirname, "emailTemplates", "verification.html"), { encoding: "utf-8" });
        const options = {
            brand_name: "LogiSick",
            user_name: this.user.userName,
            otp_code: this.user.otp,
            reset_ttl_minutes: 10,
            verify_url: `${process.env.FRONTEND_URL}/otp`,
            support_email: "ravishranjan2003@gmail.com",
            year: new Date().getFullYear(),
        };
        const template = handlebars_1.default.compile(verificationHtml)(options);
        const subject = `Verify your email`;
        await this.sendMail(template, subject);
    }
    // send reset link to the user
    async sendResetLink() {
        const verificationHtml = (0, fs_1.readFileSync)(path_1.default.join(__dirname, "emailTemplates", "resetPassword.html"), { encoding: "utf-8" });
        const options = {
            brand_name: "LogiSick",
            user_name: this.user.userName,
            reset_url: this.url,
            support_email: "ravishranjan2003@gmail.com",
            year: new Date().getFullYear(),
            otp_ttl_minutes: 10,
        };
        const template = handlebars_1.default.compile(verificationHtml)(options);
        const subject = `Reset your password`;
        await this.sendMail(template, subject);
    }
    // send org invite link to user
    async sendOrgInviteLink() {
        const verificationHtml = (0, fs_1.readFileSync)(path_1.default.join(__dirname, "emailTemplates", "orgInvite.html"), { encoding: "utf-8" });
        const options = {
            org_name: this.user.orgName,
            brand_name: "LogiSick",
            invite_url: this.url,
            role: this.user.role,
            support_email: "ravishranjan2003@gmail.com",
            year: new Date().getFullYear(),
            invite_ttl_days: 10,
        };
        const template = handlebars_1.default.compile(verificationHtml)(options);
        const subject = `Accept Invite`;
        await this.sendMail(template, subject);
    }
}
exports.default = Email;
