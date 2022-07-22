import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { join } from 'path';

import { StatusInvoice } from '../../../../../common/constants/statusReceipt';
import { STATIC_FOLDER } from '../../../../../common/constants/system';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { AttendeeDomain, InvoiceDomain } from '../../../../../domain';
import { removeAccents } from '../../../../../utils/normalize';
import { AttendeeDto, CreateAttendeeDto } from '../../../infrastructures/dtos/attendee';
import { AttendeeMap, InvoiceMap } from '../../../mapper';
import { AttendeeRepository, InvoiceRepository, ProgramRepository, UserRepository } from '../../../repositories';
import { ProgramErrors } from '../../programs';
import { AttendeeErrors } from '../attendee.error';

type Response = Either<
	AppError.UnexpectedError |
	ProgramErrors.NotFound |
	AttendeeErrors.Error,
  Result<AttendeeDto>
>;
const urlQR = join(__dirname,'..', '..', '..', '..','..','..',STATIC_FOLDER);
@Injectable()
export class CreateAttendeeUsecase implements IUseCase<CreateAttendeeDto, Promise<Response>> {
	constructor(
		@Inject('AttendeeRepository') public readonly repo: AttendeeRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
		@Inject('UserRepository') public readonly userRepo: UserRepository,
		@Inject('InvoiceRepository') public readonly invoiceRepo: InvoiceRepository,
		private event: EventEmitter2,

	) { }

	async execute(dto: CreateAttendeeDto): Promise<Response> {

		const program = await this.programRepo.findOne({
			where: {
				id: dto.programId
			},
			relations:['attendees']
		});
		if (!program) {
			return left(new ProgramErrors.NotFound());
		}

		if (!program.canRegister()) {
			return left(new AttendeeErrors.Error('Sự kiện này đã đủ số lượng hoặc quá hạn đăng ký !'));
		}

		const check = await this.repo.findOne({
			where: {
				program: {
					id: dto.programId
				},
				user: {
					id: dto.userId
				}
			},
			relations:['user', 'program', 'invoice']
		});
		if (check) {

			if (!check.invoice.isPaid()) {
				return left(
					new AttendeeErrors.Error('Bạn chưa thanh toán phí tham gia, hãy thanh toán rồi hãy check-in!')
				);
			}

			if (!check.program.allowCheckIn) {
				return left(
					new AttendeeErrors.Error('Chương trình này chưa cho phép check-in. Hãy thử lại sau!')
				);
			}

			check.checkIn();
			const entity = AttendeeMap.toEntity(check);
			await this.repo.save(entity);
			return right(Result.ok(AttendeeMap.toDto(check)));

		}

		const invoiceDomain = new InvoiceDomain({
			amount: program.price,
			info: `Thanh toan phi dang ky tham gia su kien ${removeAccents(program.name)}`,
			status: StatusInvoice.PENDING,
		});

		const invoiceEntity = InvoiceMap.toCreateEntity(invoiceDomain);

		const invoice = await this.invoiceRepo.save(invoiceEntity);

		const user = await this.userRepo.findById(dto.userId);
		const attendee = new AttendeeDomain({ invoice, user, program });
		const entity = AttendeeMap.toCreateEntity(attendee);
		entity.createdBy = dto.userId;
		entity.updatedBy = dto.userId;
		const result = await this.repo.save(entity);
		if (program.isFree()) {
			result.invoice.paid();
			result.invoice.payDate = moment().add(7, 'h').toDate();
			const invEntity = InvoiceMap.toEntity(result.invoice);
			await this.invoiceRepo.save(invEntity);
			await result.generateQRCode();
			const updateAttendee = AttendeeMap.toEntity(result);
			await this.repo.save(updateAttendee);
		}

		const attendeeDto = AttendeeMap.toDto(result);
		this.event.emit('program.register', attendeeDto);
		return right(Result.ok(attendeeDto));
	}

}
