import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { AttendeeDto } from '../../../infrastructures/dtos/attendee';
import { AttendeeMap } from '../../../mapper';
import { AttendeeRepository, InvoiceRepository, ProgramRepository } from '../../../repositories';
import { AttendeeErrors } from '../attendee.error';

type Response = Either<
	AppError.UnexpectedError |
	AttendeeErrors.NotFound |
	AttendeeErrors.Forbidden|
	AttendeeErrors.Error,
  Result<AttendeeDto>
>;
@Injectable()
export class GetAttendeeUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('AttendeeRepository') public readonly repo: AttendeeRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
		@Inject('UserRepository') public readonly userRepo: ProgramRepository,
		@Inject('InvoiceRepository') public readonly invoiceRepo: InvoiceRepository,

	) { }

	async execute(id: number, userId: number): Promise<Response> {
		const domain = await this.repo.findOne({
			where: {
				id
			},
			relations:['user', 'program','program.attendees', 'invoice']
		});
		if (!domain) {
			return left(new AttendeeErrors.NotFound());
		}

		if (domain.user.isUser() && !domain.user.isMe(userId)) {
			return left(new AttendeeErrors.Forbidden());
		}

		return right(Result.ok(AttendeeMap.toDto(domain)));
	}

}
