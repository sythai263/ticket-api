import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';

import { STATIC_FOLDER } from '../../../../../common/constants/system';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { AttendeeDto } from '../../../infrastructures/dtos/attendee';
import { AttendeeMap } from '../../../mapper';
import { AttendeeRepository } from '../../../repositories';
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
export class AdminCheckInAttendeeUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('AttendeeRepository') public readonly repo: AttendeeRepository,

	) { }

	async execute(id: number, userId: number): Promise<Response> {

		const attendee = await this.repo.findOne({
			where: {
				id,
			},
			relations:['user', 'program', 'invoice']
		});
		if (!attendee) {
			return left(new AttendeeErrors.NotFound());
		}

		if (!attendee.invoice.isPaid()) {
			return left(
				new AttendeeErrors.Error('Bạn chưa thanh toán phí tham gia, hãy thanh toán rồi hãy check-in!')
			);
		}

		if (!attendee.program.allowCheckIn) {
			return left(
				new AttendeeErrors.Error('Chương trình này chưa cho phép check-in. Hãy thử lại sau!')
			);
		}

		if (attendee.user.isUser() && !attendee.user.isMe(userId)) {
			return left(
				new AttendeeErrors.Error('Không thể check-in hộ người khác được !')
			);
		}

		attendee.checkIn();
		const entity = AttendeeMap.toEntity(attendee);
		await this.repo.save(entity);

		return right(Result.ok(AttendeeMap.toDto(attendee)));
	}

}
