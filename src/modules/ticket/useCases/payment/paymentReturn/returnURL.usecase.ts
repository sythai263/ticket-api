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
import { AttendeeMap, InvoiceMap } from '../../../mapper';
import { AttendeeRepository, InvoiceRepository } from '../../../repositories';
import { PaymentErrors } from '../payment.error';

type Response = Either<
	AppError.UnexpectedError |
	PaymentErrors.NotFound |
	PaymentErrors.Forbidden|
	PaymentErrors.Error,
  Result<InvoiceDto>
>;
@Injectable()
export class PaymentReturnUsecase implements IUseCase<PaymentReturnDto, Promise<Response>> {
	constructor(
		@Inject('InvoiceRepository') public readonly repo: InvoiceRepository,
		@Inject('AttendeeRepository') public readonly attendeeRepo: AttendeeRepository,
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

			const domain = await this.repo.findById(id);
			if (!domain) {
				return left(new PaymentErrors.NotFound());
			}

			if (dto.vnp_ResponseCode === '00') {
				const attDomain = await this.attendeeRepo.findOne({
					where: {
						invoice: {
							id
						}
					},
					relations:['user', 'program', 'invoice']
				});
				await attDomain.generateQRCode();
				domain.bankCode = dto.vnp_BankCode;
				domain.amount = Number(dto.vnp_Amount) / 100;
				domain.bankTransNo = dto.vnp_BankTranNo;
				domain.cardType = dto.vnp_CardType;
				domain.payDate = moment(dto.vnp_PayDate, 'YYYYMMDDHHmmss').toDate();
				domain.paid();
				const entity = InvoiceMap.toEntity(domain);
				const attendee = AttendeeMap.toEntity(attDomain);
				attendee.updatedBy = VNPAY_SYSTEM;
				entity.updatedBy = VNPAY_SYSTEM;

				await Promise.all([
					this.attendeeRepo.save(attendee),
					this.repo.save(entity)
				]);
				attDomain.invoice = domain;
				const attDto = AttendeeMap.toDto(attDomain);
				this.event.emit('program.register', attDto);

				return right(Result.ok(InvoiceMap.toDto(domain)));
			}

			return left(new PaymentErrors.Error('Lỗi trong quá trình thanh toán !'));
		}

		return left(new PaymentErrors.Error('Sai chữ ký !!!'));

	}

}
