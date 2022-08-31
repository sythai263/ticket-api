/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OAuth2Client } from 'google-auth-library';
import * as moment from 'moment';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

import { ConfigService } from '../../../shared/services/config.service';
import { AttendeeDto } from '../infrastructures/dtos/attendee';
import { PurchaseDto } from '../infrastructures/dtos/purchase';
import { MailEvent } from './mail.event';

@Injectable()
export class EventListener {
	constructor(public configService: ConfigService) {}

	@OnEvent('password.reset')
	async handlePasswordResetEvent(dto: MailEvent): Promise<void> {
		try {
			const clientId = this.configService.get('GOOGLE_CLIENT_ID');
			const secret = this.configService.get('GOOGLE_SECRET');
			const refreshToken = this.configService.get('GOOGLE_REFRESH_TOKEN');
			const admin = this.configService.get('EMAIL_ADMIN');
			const auth = new OAuth2Client(clientId, secret);

			auth.setCredentials({
				refresh_token: refreshToken,
			});
			const accessTokenObject = await auth.getAccessToken();
			const accessToken = accessTokenObject?.token;
			const transport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					accessToken,
					clientId,
					refreshToken,
					type: 'OAuth2',
					user: admin,
				},
			});
			const mailOption = {
				from: 'Ticket App',
				to: dto.email,
				subject: 'Mật khẩu của bạn đã được thay đổi!',
				html: `
				<p>Bạn đã yêu cầu khôi phục lại mật khẩu của mình !</p>
				<p>Mật khẩu mới của bạn là: 
					<b>${dto.password}</b>
				</p>
				<h3>Hãy đăng nhập bằng mật khẩu mới và thay đổi nó ngay lập tức !</h3>
				`,
			};

			await transport.sendMail(mailOption);
		} catch (error) {}
	}

	@OnEvent('program.register')
	async handleSendQRCodeEvent(dto: AttendeeDto): Promise<void> {
		try {
			const clientId = this.configService.get('GOOGLE_CLIENT_ID');
			const secret = this.configService.get('GOOGLE_SECRET');
			const refreshToken = this.configService.get('GOOGLE_REFRESH_TOKEN');
			const admin = this.configService.get('EMAIL_ADMIN');
			const homeUrl = this.configService.get('DOMAIN');
			const auth = new OAuth2Client(clientId, secret);
			const publicFolder = join(this.configService.get('UPLOAD_FOLDER'), '..');

			auth.setCredentials({
				refresh_token: refreshToken,
			});

			dto.program.avatar = dto.program.avatar.replace(homeUrl, '');
			const accessTokenObject = await auth.getAccessToken();
			const accessToken = accessTokenObject?.token;
			const transport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					accessToken,
					clientId,
					refreshToken,
					type: 'OAuth2',
					user: admin,
				},
			});
			let subject = `Vé tham dự ${dto.program.name}`;
			const attachments = [
				{
					filename: dto.program.avatar.split('/').pop(),
					path: join(publicFolder, dto.program.avatar),
					cid: 'avatar',
				},
			];

			let html = `
		<div style="margin: auto; width: 50%; padding: 10px;">
			<div style=" margin-bottom: 3rem;">
				<img style="width: 90%; margin: auto;" src="cid:avatar" />
			</div>
			<p style="font-size: 20px;">Bạn đã đăng ký tham dự chương trình <b>${dto.program.name}</b> thành công!</p>
			<h1 style="text-align: center;">Thông tin đăng ký của bạn:</h1>
			<ul style="list-style: circle;">
				<li style ="line-height: 2rem;">Mã đăng ký: <b>${dto.id}</b> </li>
				<li style ="line-height: 2rem;">Họ tên: ${dto.user.lastName} <b>${dto.user.firstName}</b> </li>
				<li style ="line-height: 2rem;">Tên chương trình: <b>${dto.program.name}</b> </li>
				<li style ="line-height: 2rem;">Phí tham gia: <b>${dto.program.price.toLocaleString('vi-VN', {
					style: 'currency',
					currency: 'VND',
				})}</b></li>
				<li style ="line-height: 2rem;">Thanh toán: <b>${dto.invoice.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</b></li>
				<li style ="line-height: 2rem;">Hình thức thanh toán: <b>${
					dto.invoice.cardType ? dto.invoice.cardType : 'Chương trình miễn phí'
				}</b></li>
				<li style ="line-height: 2rem;">Mã ngân hàng thanh toán: <b>${
					dto.invoice.bankCode ? dto.invoice.bankCode : 'Chương trình miễn phí'
				}</b></li>
				<li style ="line-height: 2rem;">Mã tham chiếu: <b>${
					dto.invoice.bankTransNo ? dto.invoice.bankTransNo : 'Chương trình miễn phí'
				}</b></li>
				<li style ="line-height: 2rem;">Ngày thanh toán: <b>${moment(dto.invoice.payDate).format(
					'HH:mm:ss DD/MM/YYYY',
				)}</b></li>
			</ul>
			<h2> Mã QRCode tham gia của bạn: </h2>
			<div>
				<img style="width: 90%; margin: auto;" src="cid:qrcode"
						 alt="Mã QR Code của ${dto.user.lastName} ${dto.user.firstName}" />
			</div>
		</div>
		`;
			if (dto.invoice.isPaid) {
				dto.imageQR = dto.imageQR.replace(homeUrl, '');
				attachments.push({
					filename: dto.imageQR.split('/').pop(),
					path: join(publicFolder, dto.imageQR),
					cid: 'qrcode',
				});
			}

			if (!dto.invoice.isPaid) {
				subject = `Đăng ký tham gia ${dto.program.name}`;
				html = `
		<div style="margin: auto; width: 50%; padding: 10px;">
			<div style=" margin-bottom: 3rem;">
				<img style="width: 90%; margin: auto;" src="cid:avatar" />
			</div>
			<p style="font-size: 20px;">Bạn đã đăng ký tham dự chương trình <b>${dto.program.name}</b> thành công!</p>
			<h1 style="text-align: center;">Thông tin đăng ký của bạn:</h1>
			<ul style="list-style: circle;">
				<li style ="line-height: 2rem;">Mã đăng ký: <b>${dto.id}</b> </li>
				<li style ="line-height: 2rem;">Họ tên: ${dto.user.lastName} <b>${dto.user.firstName}</b> </li>
				<li style ="line-height: 2rem;">Tên chương trình: <b>${dto.program.name}</b> </li>
				<li style ="line-height: 2rem;">Phí tham gia: <b>${dto.program.price.toLocaleString('vi-VN', {
					style: 'currency',
					currency: 'VND',
				})}</b></li>
				<li style ="line-height: 2rem;">Thanh toán: <b>${dto.invoice.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</b></li>
			</ul>
			<h2>Bạn chưa thanh toán cho đơn đăng ký này, vui lòng thanh toán trong vòng <b>12 tiếng </b></h2>
			<a target="_blank" style="display: block; width: 90%; border: none; background-color: #325ca8; padding: 14px; font-size: 16px; text-align: center; text-decoration: none; color: #fff; border-radius: 10px; font-size: large; text-transform: uppercase;" href="${homeUrl}api/payment/invoice/${
					dto.invoice.id
				}">Thanh toán ngay</a>
		</div>
`;
			}

			const mailOption = {
				from: 'Ticket App',
				to: dto.user.email,
				subject,
				html,
				attachments,
			};

			await transport.sendMail(mailOption);
		} catch (error) {}
	}

	@OnEvent('purchase.order')
	async handlePurchaseEvent(dto: PurchaseDto): Promise<void> {
		try {
			const clientId = this.configService.get('GOOGLE_CLIENT_ID');
			const secret = this.configService.get('GOOGLE_SECRET');
			const refreshToken = this.configService.get('GOOGLE_REFRESH_TOKEN');
			const admin = this.configService.get('EMAIL_ADMIN');
			const domain = this.configService.get('HOME_URL');
			const auth = new OAuth2Client(clientId, secret);
			const publicFolder = join(this.configService.get('UPLOAD_FOLDER'), '..');

			auth.setCredentials({
				refresh_token: refreshToken,
			});
			const accessTokenObject = await auth.getAccessToken();
			const accessToken = accessTokenObject?.token;
			const transport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					accessToken,
					clientId,
					refreshToken,
					type: 'OAuth2',
					user: admin,
				},
			});

			const info = `
			<div>
				<h1 style="text-align: center;">Thông tin đơn hàng:</h1>
				<ul style="list-style: circle;">
					<li style="line-height: 2rem;">Mã đơn hàng: <b>${dto.id}</b> </li>
					<li style="line-height: 2rem;">Họ tên: ${dto.user.lastName} <b>${dto.user.firstName}</b> </li>
					<li style="line-height: 2rem;">Thanh toán: <b>${dto.invoice.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</b>
					</li>
				</ul>
			</div>
		`;

			const tableHeader = `
				<tr style="border: 1px solid; height: 3rem;">
					<th style="text-align: center;">STT</th>
					<th style="text-align: left;">Tên sản phẩm</th>
					<th style="text-align: right;">Đơn giá (đ)</th>
					<th style="text-align: right;">Số lượng</th>
					<th style="text-align: right;">Giảm giá</th>
					<th style="text-align: right;  padding-right: 10px;">Thành tiền (đ)</th>
				</tr>
		`;
			const tableBody = dto.details.reduce((prev, curr, index) => {
				const row = `
			<tr style="border: 1px solid; height: 2rem;">
					<td style="text-align: center;">${index + 1}</td>
					<td>${curr.product.name}</td>
					<td style="text-align: right;">${curr.product.price.toLocaleString('vi-VN', {
						style: 'currency',
						currency: 'VND',
					})}</td>
					<td style="text-align: right;">${curr.amount}</td>
					<td style="text-align: right;">${curr.discountAmount.toLocaleString('vi-VN', {
						style: 'currency',
						currency: 'VND',
					})}</td>
					<td style="text-align: right;  padding-right: 10px;">${curr.total.toLocaleString('vi-VN', {
						style: 'currency',
						currency: 'VND',
					})}</td>
				</tr>
			`;
				return prev + row;
			}, '');

			const tableFooter = `
		<tr style="height: 3rem;">
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td style="text-align: right;"><b>Tổng: </b></td>
					<td style="text-align: right; padding-right: 10px;">${dto.invoice.amount.toLocaleString('vi-VN', {
						style: 'currency',
						currency: 'VND',
					})}</td>
				</tr>
		`;
			const detailSum = `
			<div>
				<ul style="list-style: circle;">
					<li style="line-height: 2rem; list-style: none; text-align: right;">Tổng tiền (đ): <b>${dto.summary.toLocaleString(
						'vi-VN',
						{ style: 'currency', currency: 'VND' },
					)}</b>
					</li>
					<li style="line-height: 2rem; list-style: none; text-align: right;">Giảm giá (đ): <b>${dto.discountAmount.toLocaleString(
						'vi-VN',
						{ style: 'currency', currency: 'VND' },
					)}</b>
					</li>
					<li style="line-height: 2rem; list-style: none; text-align: right;">Thành tiền (đ): <b>${dto.invoice.amount.toLocaleString(
						'vi-VN',
						{ style: 'currency', currency: 'VND' },
					)}</b>
					</li>
				</ul>
			</div>
		`;

			const table = `
		<h2 style="text-align: center; margin-top: 2rem;">Chi tiết đơn hàng</h2>
		<table style="border-collapse: collapse; width: 100%; border: 1px solid;">
		${tableHeader}
		${tableBody}
		${tableFooter}
		</table>
		`;
			let payment = `
		<h2>Bạn chưa thanh toán cho đơn đăng ký này, vui lòng thanh toán trong vòng <b>12 tiếng </b></h2>
			<div style="display: block; margin-left: auto; margin-right: auto; width: 200px;">
				<a target="_blank"
					 style="display: block; width: 100%; border: none; background-color: #325ca8; padding: 14px; font-size: 16px; text-align: center; text-decoration: none; color: #fff; border-radius: 10px; font-size: large; text-transform: uppercase;"
					 href="${domain}/api/payment/order/${dto.id}">Thanh toán ngay</a>
			</div>
		`;
			if (dto.invoice.isPaid) {
				payment = '<h2>Đơn hàng đã được xác nhận và sẽ giao tới bạn sớm nhất !</h2>';
			}

			const subject = `Xác nhận đơn hàng #${dto.id}`;
			const html = `
		<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: auto; width: 800px;">
		${info}
		${table}
		${detailSum}
		${payment}
		</div>
		`;

			const mailOption = {
				from: 'Ticket App',
				to: dto.user.email,
				subject,
				html,
			};

			await transport.sendMail(mailOption);
		} catch (error) {}
	}
}
