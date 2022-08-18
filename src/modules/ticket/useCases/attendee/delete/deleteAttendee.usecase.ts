import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { AttendeeRepository, InvoiceRepository } from '../../../repositories';
import { AttendeeErrors } from '../attendee.error';

type Response = Either<
	AppError.UnexpectedError | AttendeeErrors.NotFound | AttendeeErrors.Forbidden | AttendeeErrors.Error,
	Result<boolean>
>;
@Injectable()
export class DeleteAttendeeUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('AttendeeRepository') public readonly repo: AttendeeRepository,
		@Inject('InvoiceRepository') public readonly invoiceRepo: InvoiceRepository,
	) {}

	async execute(id: number, userId: number): Promise<Response> {
		const domain = await this.repo.findById(id);
		if (!domain) {
			return left(new AttendeeErrors.NotFound());
		}

		if (domain.user.isUser() && !domain.user.isMe(userId)) {
			return left(new AttendeeErrors.Forbidden());
		}

		if (domain.program.checkCanUpdate()) {
			return left(new AttendeeErrors.Error('Không thể xóa do chương trình đã diễn ra rồi !'));
		}

		if (domain.isCheckIn) {
			return left(new AttendeeErrors.Error('Không thể xóa do đã check in'));
		}

		await this.repo.softDelete(id, userId);
		await this.invoiceRepo.softDelete(domain.invoice.id.toValue(), userId);
		return right(Result.ok(true));
	}
}
