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
	Result<AttendeeDto>
>;
@Injectable()
export class GetAttendeeByProgramUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('AttendeeRepository') public readonly repo: AttendeeRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
		@Inject('UserRepository') public readonly userRepo: ProgramRepository,
		@Inject('InvoiceRepository') public readonly invoiceRepo: InvoiceRepository,
	) {}

	async execute(id: number, userId?: number): Promise<Response> {
		try {
			const domain = await this.repo.findOne({
				where: {
					user: {
						id: userId,
					},
					program: {
						id,
					},
				},
			});
			if (domain) {
				return right(Result.ok(AttendeeMap.toDto(domain)));
			}

			return left(new AttendeeErrors.NotFound());
		} catch (error) {
			return left(new AttendeeErrors.NotFound());
		}
	}
}
