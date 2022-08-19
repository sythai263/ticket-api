import { Inject, Injectable } from '@nestjs/common';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { SearchProgramDto } from '../../../infrastructures/dtos/program/searchProgram.dto';
import { PaginationReviewProgramDto } from '../../../infrastructures/dtos/reviewProgram';
import { ReviewProgramMap } from '../../../mapper';
import { ReviewProgramRepository } from '../../../repositories';
import { ReviewProgramErrors } from '../reviewProgram.error';

type Response = Either<
	AppError.UnexpectedError | ReviewProgramErrors.NotFound | ReviewProgramErrors.Error,
	Result<PaginationReviewProgramDto>
>;

@Injectable()
export class GetReviewsProgramsUsecase implements IUseCase<SearchProgramDto, Promise<Response>> {
	constructor(@Inject('ReviewProgramRepository') public readonly repo: ReviewProgramRepository) {}

	async execute(dto: PageOptionsDto, id: number, userId?: number): Promise<Response> {
		const result = await this.repo.search(id, dto);
		if (!result) {
			return left(new ReviewProgramErrors.Error('Không tìm thấy chương trình này!'));
		}

		const data = ReviewProgramMap.toDtos(result[0], userId);
		const meta = new PageMetaDto(dto, result[1]);
		const response = new PaginationReviewProgramDto(data, meta);

		return right(Result.ok(response));
	}
}
