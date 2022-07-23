
/* eslint-disable camelcase */
import {
	BadRequestException,
	Controller, Get, HttpCode,
	HttpStatus, InternalServerErrorException, NotFoundException, Param, Query, Req, Res, UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiBadRequestResponse, ApiInternalServerErrorResponse,
	ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse,
	ApiTags
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { stringify } from 'qs';

import { SuccessNotification } from '../../../../core/infra/Success';
import { ConfigService } from '../../../../shared/services/config.service';
import { AttendeeDto } from '../../infrastructures/dtos/attendee';
import { InvoiceDto } from '../../infrastructures/dtos/invoice';
import { PaymentReturnDto } from '../../infrastructures/dtos/payment';
import { PaymentAttendanceUsecase } from './create/payment.usecase';
import { PaymentOrderUsecase } from './create/paymentOrder.usecase';
import { IpnVNPayUsecase } from './ipnURL/ipnURL.usecase';
import { PaymentErrors } from './payment.error';
import { PaymentReturnAttendanceUsecase } from './paymentReturn/returnAttendance.usecase';
import { PaymentReturnOrderUsecase } from './paymentReturn/returnOrder.usecase';
@Controller('api/payment')
@ApiTags('Payment')
export class PaymentController {
	constructor(
		public readonly payment: PaymentAttendanceUsecase,
		public readonly paymentReturn: PaymentReturnAttendanceUsecase,
		public readonly paymentOrder: PaymentOrderUsecase,
		public readonly paymentReturnOrder: PaymentReturnOrderUsecase,
		public readonly ipn: IpnVNPayUsecase,
		private config: ConfigService,
	) { }

	@Get('invoice/:id')
	@ApiOperation({
		description: 'Thanh toán phí tham gia',
		summary:'Thanh toán phí tham gia'
	})
	@ApiParam({
		name: 'id',
		description: 'Mã hóa đơn'
	})
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({
		type: InvoiceDto
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})

	@ApiNotFoundResponse({
		description: 'Not found'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async execute(
		@Req() req: Request,
		@Res() res: Response,
		@Param('id') id: number): Promise<SuccessNotification> {
		const result = await this.payment.execute(id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case PaymentErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			case PaymentErrors.Error:
				throw new BadRequestException(err.errorValue());
			case PaymentErrors.Paid:
				res.statusCode = HttpStatus.OK;
				res.json({ info: err.errorValue() });
				return;
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		} else {
			const { createHmac } = await import('node:crypto');
			const ipAddr = req.headers['x-forwarded-for'] ||
				req.socket.remoteAddress;
			let paymentGateway = this.config.get('vnp_Url');
			const secureSecret = this.config.get('vnp_HashSecret');
			const vnpData = result.value.getValue();
			vnpData.vnp_IpAddr = ipAddr;

			let signData = stringify(vnpData);
			signData = signData.replace(/%20/g, '+');
			const hmac = createHmac('sha512', secureSecret);
			const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
			vnpData.vnp_SecureHash = signed;

			paymentGateway += '?' + stringify(vnpData);
			res.redirect(paymentGateway);
		}
	}

	@Get('attendance-return')
	@ApiOperation({
		description: 'Nhận kết quả từ hệ thống thanh toán VNPay',
		summary:'Nhận kết quả từ hệ thống thanh toán VNPay'
	})
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({
		type: AttendeeDto
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})

	@ApiNotFoundResponse({
		description: 'Not found'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async returnPayment(
		@Req() req: Request,
		@Res() res: Response,
		@Query() dto: PaymentReturnDto): Promise<AttendeeDto> {
		const result = await this.paymentReturn.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case PaymentErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			case PaymentErrors.Error:
				throw new BadRequestException(err.errorValue());
			case PaymentErrors.Paid:
				res.statusCode = HttpStatus.OK;
				res.json(err.errorValue());
				return;
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		res.json(result.value.getValue());
	}

	@Get('order/:id')
	@ApiOperation({
		description: 'Thanh toán phí mua hàng',
		summary:'Thanh toán phí mua hàng'
	})
	@ApiParam({
		name: 'id',
		description: 'Mã đơn hàng'
	})
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({
		type: InvoiceDto
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})

	@ApiNotFoundResponse({
		description: 'Not found'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async payOrder(
		@Req() req: Request,
		@Res() res: Response,
		@Param('id') id: number): Promise<SuccessNotification> {
		const result = await this.paymentOrder.execute(id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case PaymentErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			case PaymentErrors.Error:
				throw new BadRequestException(err.errorValue());
			case PaymentErrors.Paid:
				res.statusCode = HttpStatus.OK;
				res.json({ info: err.errorValue() });
				return;
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		} else {
			const { createHmac } = await import('node:crypto');
			const ipAddr = req.headers['x-forwarded-for'] ||
				req.socket.remoteAddress;
			let paymentGateway = this.config.get('vnp_Url');
			const secureSecret = this.config.get('vnp_HashSecret');
			const vnpData = result.value.getValue();
			vnpData.vnp_IpAddr = ipAddr;

			let signData = stringify(vnpData);
			signData = signData.replace(/%20/g, '+');
			const hmac = createHmac('sha512', secureSecret);
			const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
			vnpData.vnp_SecureHash = signed;

			paymentGateway += '?' + stringify(vnpData);
			res.redirect(paymentGateway);
		}
	}

	@Get('order-return')
	@ApiOperation({
		description: 'Nhận kết quả từ hệ thống thanh toán VNPay',
		summary:'Nhận kết quả từ hệ thống thanh toán VNPay'
	})
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({
		type: InvoiceDto
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})

	@ApiNotFoundResponse({
		description: 'Not found'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async returnOrderPayment(
		@Req() req: Request,
		@Res() res: Response,
		@Query() dto: PaymentReturnDto): Promise<InvoiceDto> {
		const result = await this.paymentReturnOrder.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case PaymentErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			case PaymentErrors.Error:
				throw new BadRequestException(err.errorValue());
			case PaymentErrors.Paid:
				res.statusCode = HttpStatus.OK;
				res.json(err.errorValue());
				return;
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		res.json(result.value.getValue());
	}

	@Get('vnpay-ipn')
	@ApiOperation({
		description: 'Nhận kết quả từ hệ thống thanh toán VNPay',
		summary:'Nhận kết quả từ hệ thống thanh toán VNPay'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async ipnURL(
		@Req() req: Request,
		@Res() res: Response,
		@Query() dto: PaymentReturnDto): Promise<InvoiceDto> {
		const result = await this.ipn.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case PaymentErrors.NotFound:
				res.status(HttpStatus.OK).json({ RspCode: '01', Message: err.errorValue() });
				return;
			case PaymentErrors.Error:
				res.status(HttpStatus.OK).json({ RspCode: '97', Message: err.errorValue() });
				return;
			case PaymentErrors.Paid:
				res.status(HttpStatus.OK).json({ RspCode: '99', Message: err.errorValue() });
				return;
			case PaymentErrors.NotEnoughMoney:
				res.status(HttpStatus.OK).json({ RspCode: '04', Message: err.errorValue() });
				return;
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		res.status(HttpStatus.OK).json({ RspCode: '00', Message: 'Giao dịch thành công' });
	}

}
