/* eslint-disable camelcase */

import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createHmac } from 'crypto';
import * as moment from 'moment';
import { stringify } from 'qs';

import { VNPAY_SYSTEM } from '../../../../../common/constants/system';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ConfigService } from '../../../../../shared/services/config.service';
import { InvoiceDto } from '../../../infrastructures/dtos/invoice';
import { PaymentReturnDto } from '../../../infrastructures/dtos/payment';
import { InvoiceMap, PurchaseMap } from '../../../mapper';
import { InvoiceRepository, PurchaseRepository } from '../../../repositories';
import { PaymentErrors } from '../payment.error';

type Response = Either<
	AppError.UnexpectedError |
	PaymentErrors.NotFound |
	PaymentErrors.Forbidden|
	PaymentErrors.Error,
  Result<InvoiceDto>
>;
@Injectable()
export class PaymentReturnOrderUsecase implements IUseCase<PaymentReturnDto, Promise<Response>> {
	constructor(
		@Inject('InvoiceRepository') public readonly repo: InvoiceRepository,
		@Inject('PurchaseRepository') public readonly purchaseRepo: PurchaseRepository,
		private config: ConfigService,
		private event: EventEmitter2,

	) { }

	async execute(dto: PaymentReturnDto): Promise<Response> {
		const secureSecret = this.config.get('vnp_HashSecret');
		const checksum = dto.vnp_SecureHash;
		dto.vnp_SecureHash = undefined;
		let signData = stringify(dto, { encode: false });
		signData = signData.replace(/\s/g, '+');
		const hmac = createHmac('sha512', secureSecret);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

		if(checksum === signed){
			const id = Number(dto.vnp_TxnRef.split('-')[0]);
			const invoiceId = Number(dto.vnp_TxnRef.split('-')[1]);

			const domain = await this.purchaseRepo.getDetails(id);
			if (!domain) {
				return left(new PaymentErrors.NotFound());
			}

			if (dto.vnp_ResponseCode === '00') {
				if (domain.invoice.id.toValue() !== invoiceId) {
					return left(new PaymentErrors.Error('Đơn hàng không khớp'));

				}

				domain.invoice.bankCode = dto.vnp_BankCode;
				domain.invoice.amount = Number(dto.vnp_Amount) / 100;
				domain.invoice.bankTransNo = dto.vnp_BankTranNo;
				domain.invoice.cardType = dto.vnp_CardType;
				domain.invoice.payDate = moment(dto.vnp_PayDate, 'YYYYMMDDHHmmss').toDate();
				domain.invoice.paid();
				const entity = InvoiceMap.toEntity(domain.invoice);
				entity.updatedBy = VNPAY_SYSTEM;

				await this.repo.save(entity);

				const purchaseDto = PurchaseMap.toDto(domain);
				this.event.emit('purchase.order', purchaseDto);

				return right(Result.ok(InvoiceMap.toDto(domain.invoice)));
			}

			return left(new PaymentErrors.Error('Lỗi trong quá trình thanh toán !'));
		}

		return left(new PaymentErrors.Error('Sai chữ ký !!!'));

	}

}
