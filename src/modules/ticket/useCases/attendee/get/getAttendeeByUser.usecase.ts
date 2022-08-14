import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { AttendeeDto } from '../../../infrastructures/dtos/attendee';
import { AttendeeMap } from '../../../mapper';
import { AttendeeRepository, InvoiceRepository, ProgramRepository } from '../../../repositories';
import { AttendeeErrors } from '../attendee.error';

type Response = Either<
	AppError.UnexpectedError | AttendeeErrors.NotFound | AttendeeErrors.Forbidden | AttendeeErrors.Error,
	Result<AttendeeDto[]>
>;
@Injectable()
export class GetAttendeeByUserUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('AttendeeRepository') public readonly repo: AttendeeRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
		@Inject('UserRepository') public readonly userRepo: ProgramRepository,
		@Inject('InvoiceRepository') public readonly invoiceRepo: InvoiceRepository,
	) {}

	async execute(userId: number): Promise<Response> {
		const domains = await this.repo.find({
			where: {
				user: { id: userId },
			},
			relations: ['user', 'program', 'invoice'],
		});
		if (!domains) {
			return left(new AttendeeErrors.NotFound());
		}

		return right(Result.ok(AttendeeMap.toDtos(domains)));
	}
}
