import { Inject, Injectable } from '@nestjs/common';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { PaginationAttendeeDto, SearchAttendeeDto } from '../../../infrastructures/dtos/attendee';
import { AttendeeMap } from '../../../mapper';
import { AttendeeRepository } from '../../../repositories';
import { AttendeeErrors } from '../../attendee';

type Response = Either<
	AppError.UnexpectedError | AttendeeErrors.NotFound | AttendeeErrors.Forbidden | AttendeeErrors.Error,
	Result<PaginationAttendeeDto>
>;
@Injectable()
export class GetListAttendeeUsecase implements IUseCase<SearchAttendeeDto, Promise<Response>> {
	constructor(@Inject('AttendeeRepository') public readonly repo: AttendeeRepository) {}

	async execute(search: SearchAttendeeDto): Promise<Response> {
		const result = await this.repo.search(search);
		if (!result) {
			return left(new AttendeeErrors.Error('Không có kết quả phù hợp'));
		}

		const meta = new PageMetaDto(search, result[1]);
		const data = AttendeeMap.toDtosShort(result[0]);
		const response = new PaginationAttendeeDto(data, meta);
		return right(Result.ok(response));
	}
}
