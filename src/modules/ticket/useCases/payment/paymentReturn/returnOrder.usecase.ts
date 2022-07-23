/* eslint-disable camelcase */

import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createHmac } from 'crypto';
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
import { PurchaseErrors } from '../../purchase/purchase.error';
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
			const id = Number(dto.vnp_TxnRef.split('-')[1]);
			const domain = await this.purchaseRepo.getDetails(id);

			if (dto.vnp_ResponseCode === '00') {
				if (!domain.changeStatusToConfirm()) {
					return left(new PurchaseErrors.Error('Đơn hàng đã được xác nhận !'));
				}

				const purchaseEnt = PurchaseMap.toEntity(domain);
				purchaseEnt.updatedBy = VNPAY_SYSTEM;

				await this.purchaseRepo.save(purchaseEnt);

				const purchaseDto = PurchaseMap.toDto(domain);
				this.event.emit('purchase.order', purchaseDto);

				return right(Result.ok(InvoiceMap.toDto(domain.invoice)));
			}

			return left(new PaymentErrors.Error('Lỗi trong quá trình thanh toán !'));
		}

		return left(new PaymentErrors.Error('Sai chữ ký !!!'));
	}

}
