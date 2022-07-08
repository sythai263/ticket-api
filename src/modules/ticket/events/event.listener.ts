/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';

import { ConfigService } from '../../../shared/services/config.service';
import { MailEvent } from './mail.event';

@Injectable()
export class EventListener {
	constructor(
		public configService: ConfigService,

	) {}

  @OnEvent('password.reset')
	async handlePasswordResetEvent(dto: MailEvent): Promise<void> {
		const clientId = this.configService.get('GOOGLE_CLIENT_ID');
		const secret = this.configService.get('GOOGLE_SECRET');
		const refreshToken = this.configService.get('GOOGLE_REFRESH_TOKEN');
		const admin = this.configService.get('EMAIL_ADMIN');
		const auth = new OAuth2Client(clientId, secret);

		auth.setCredentials({
			refresh_token: refreshToken
		});
		const accessTokenObject = await auth.getAccessToken();
		const accessToken = accessTokenObject?.token;
		const transport = nodemailer.createTransport(
			{
				service: 'gmail',
				auth: {
					accessToken,
					clientId,
					refreshToken,
					type: 'OAuth2',
					user: admin,
				}
			}
		);
		const mailOption = {
			from: 'Ticket App',
			to: dto.email,
			subject: 'Password has been reset !',
			html: `
				<p>Password has been reset !</p>
				<p>New password: 
					<b>${dto.password}</b>
				</p>
				<h3>Please login with new password and change it !</h3>
				`
		};
		await transport.sendMail(mailOption);

	}
}
