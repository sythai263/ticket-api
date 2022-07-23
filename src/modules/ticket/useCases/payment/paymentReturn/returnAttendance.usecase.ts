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
import { AttendeeDto } from '../../../infrastructures/dtos/attendee';
import { PaymentReturnDto } from '../../../infrastructures/dtos/payment';
import { AttendeeMap } from '../../../mapper';
import { AttendeeRepository, InvoiceRepository } from '../../../repositories';
import { PaymentErrors } from '../payment.error';

type Response = Either<
	AppError.UnexpectedError |
	PaymentErrors.NotFound |
	PaymentErrors.Forbidden|
	PaymentErrors.Error,
  Result<AttendeeDto>
>;
@Injectable()
export class PaymentReturnAttendanceUsecase implements IUseCase<PaymentReturnDto, Promise<Response>> {
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
				const attendee = AttendeeMap.toEntity(attDomain);
				attendee.updatedBy = VNPAY_SYSTEM;

				await this.attendeeRepo.save(attendee);
				const attDto = AttendeeMap.toDto(attDomain);
				this.event.emit('program.register', attDto);

				return right(Result.ok(attDto));
			}

			return left(new PaymentErrors.Error('Lỗi trong quá trình thanh toán !'));
		}

		return left(new PaymentErrors.Error('Sai chữ ký !!!'));

	}

}
