import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ConfigService } from '../../../../../shared/services/config.service';
import { PaymentDto } from '../../../infrastructures/dtos/payment/payment.dto';
import { PurchaseRepository } from '../../../repositories';
import { PaymentErrors } from '../payment.error';

type Response = Either<
	AppError.UnexpectedError | PaymentErrors.NotFound | PaymentErrors.Forbidden | PaymentErrors.Error,
	Result<PaymentDto>
>;
@Injectable()
export class PaymentOrderUsecase implements IUseCase<number, Promise<Response>> {
	constructor(@Inject('PurchaseRepository') public readonly repo: PurchaseRepository, private config: ConfigService) {}

	async execute(id: number): Promise<Response> {
		const domain = await this.repo.getDetails(id);
		if (!domain) {
			return left(new PaymentErrors.NotFound());
		}

		if (domain.invoice.isPaid()) {
			return left(new PaymentErrors.Paid());
		}

		const tmnCode = this.config.get('vnp_TmnCode');
		const returnUrl = this.config.get('DOMAIN') + '/api/payment/order-return';
		const date = moment().add(7, 'h').format('YYYYMMDDHHmmss');
		const orderId = `${domain.invoice.id.toString()}-${domain.id.toString()}-${moment().format('HHmmss')}`;
		const amount = domain.invoice.amount * 100;
		const { info } = domain.invoice;

		return right(Result.ok(new PaymentDto(tmnCode, orderId, info, amount.toString(), returnUrl, date)));
	}
}
