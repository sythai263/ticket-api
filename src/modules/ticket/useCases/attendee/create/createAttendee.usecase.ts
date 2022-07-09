import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';

import { StatusInvoice } from '../../../../../common/constants/statusReceipt';
import { STATIC_FOLDER } from '../../../../../common/constants/system';
import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { AttendeeDomain, InvoiceDomain, UserDomain } from '../../../../../domain';
import { AttendeeDto, CreateAttendeeDto } from '../../../infrastructures/dtos/attendee';
import { AttendeeMap, InvoiceMap } from '../../../mapper';
import { AttendeeRepository, InvoiceRepository, ProgramRepository } from '../../../repositories';
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
		@Inject('UserRepository') public readonly userRepo: ProgramRepository,
		@Inject('InvoiceRepository') public readonly invoiceRepo: InvoiceRepository,

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
			info: `Thanh toán phí đăng ký tham gia sự kiện ${program.name}`,
			status: StatusInvoice.PENDING
		});

		const invoiceEntity = InvoiceMap.toCreateEntity(invoiceDomain);

		const invoice = await this.invoiceRepo.save(invoiceEntity);

		const user = new UserDomain({
			username: dto.username
		}, new UniqueEntityID(dto.userId));
		const attendee = new AttendeeDomain({ invoice, user, program });
		const entity = AttendeeMap.toCreateEntity(attendee);
		entity.createdBy = dto.userId;
		entity.updatedBy = dto.userId;
		const result = await this.repo.save(entity);
		if (program.isFree()) {
			result.invoice.paid();
			await result.generateQRCode();
			const updateAttendee = AttendeeMap.toEntity(result);
			await this.repo.save(updateAttendee);
		}

		return right(Result.ok(AttendeeMap.toDto(result)));
	}

}
