import nodemailer from "nodemailer";
import sendgridTransport from 'nodemailer-sendgrid';
import { convert } from "html-to-text";
import { readFileSync } from "fs";
import path from "path";
import Handlebars from "handlebars";
import dotenv from "dotenv";

// configure the path of config file
dotenv.config({ path: "config.env" });
	

// Email handler for the application
class Email {
	private user: Record<string, string>; //contains user's name and email
	private url: string; // any url that should be included in the email to the user

	constructor(user: Record<string, string>, url: string) {
		// initialize the variables;
		this.user = user;
		this.url = url;
	}
		private newTransport() {
		const transport = nodemailer.createTransport(
			sendgridTransport({
				apiKey: process.env.SENDGRID_KEY || ''
			})
		);
		return transport;
	}
	/**
	 * @param template, template is the html that the mail will contain
	 * @param subject
	 */
	private async sendMail(template: string, subject: string) {
		try {
			const sendOptions = {
				to: this.user.email,
				from: `gaurangt.mca25@cs.du.ac.in`,
				subject,
				html: template,
				text: convert(template),
			};
			await this.newTransport().sendMail(sendOptions);
		} catch (_err) {
			console.log(_err);
		}
	}
	/**
	 * send email verification mail to the user
	 */
	public async sendVerification() {
		const verificationHtml = readFileSync(
			path.join(__dirname, "emailTemplates", "verification.html"),
			{ encoding: "utf-8" }
		);
		const options = {
			brand_name: "LogiSick",
			user_name: this.user.userName,
			otp_code: this.user.otp,
			reset_ttl_minutes: 10,
			verify_url: `${process.env.FRONTEND_URL}/otp`,
			support_email: "ravishranjan2003@gmail.com",
			year: new Date().getFullYear(),
		};
		const template = Handlebars.compile(verificationHtml)(options);
		const subject = `Verify your email`;
		await this.sendMail(template, subject);
	}
	// send reset link to the user
	public async sendResetLink() {
		const verificationHtml = readFileSync(
			path.join(__dirname, "emailTemplates", "resetPassword.html"),
			{ encoding: "utf-8" }
		);
		const options = {
			brand_name: "LogiSick",
			user_name: this.user.userName,
			reset_url: this.url,
			support_email: "ravishranjan2003@gmail.com",
			year: new Date().getFullYear(),
			otp_ttl_minutes: 10,
		};
		const template = Handlebars.compile(verificationHtml)(options);
		const subject = `Reset your password`;
		await this.sendMail(template, subject);
	}
	// send org invite link to user
	public async sendOrgInviteLink() {
		const verificationHtml = readFileSync(
			path.join(__dirname, "emailTemplates", "orgInvite.html"),
			{ encoding: "utf-8" }
		);
		const options = {
			org_name: this.user.orgName,
			brand_name: "LogiSick",

			invite_url: this.url,
			role: this.user.role,
			support_email: "ravishranjan2003@gmail.com",
			year: new Date().getFullYear(),
			invite_ttl_days: 10,
		};
		const template = Handlebars.compile(verificationHtml)(options);
		const subject = `Accept Invite`;
		await this.sendMail(template, subject);
	}
}
export default Email;
