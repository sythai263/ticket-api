
/* eslint-disable camelcase */
import {
	BadRequestException,
	Controller, Get, HttpCode,
	HttpStatus, InternalServerErrorException, NotFoundException, Param, Query, Req, Res, UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse, ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { stringify } from 'qs';

import { SuccessNotification } from '../../../../core/infra/Success';
import { ConfigService } from '../../../../shared/services/config.service';
import { InvoiceDto } from '../../infrastructures/dtos/invoice';
import { PaymentReturnDto } from '../../infrastructures/dtos/payment';
import { PaymentUsecase } from './create/payment.usecase';
import { PaymentErrors } from './payment.error';
import { PaymentReturnUsecase } from './paymentReturn/returnURL.usecase';
@Controller('api/payment')
@ApiTags('Payment')
export class PaymentController {
	constructor(
		public readonly payment: PaymentUsecase,
		public readonly paymentReturn: PaymentReturnUsecase,
		private config: ConfigService,
	) { }

	@Get('invoice/:id')
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({
		type: InvoiceDto
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden'
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

	@Get('return')
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({
		type: InvoiceDto
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden'
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
		@Query() dto: PaymentReturnDto): Promise<SuccessNotification> {
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
				res.json({ info: err.errorValue() });
				return;
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}
	}

}
