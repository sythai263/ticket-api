import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ReviewProgramDto, UpdateReviewProgramDto } from '../../../infrastructures/dtos/reviewProgram';
import { ReviewProgramMap } from '../../../mapper';
import { ReviewProgramRepository } from '../../../repositories';
import { ReviewProgramErrors } from '../reviewProgram.error';

type Response = Either<
	AppError.UnexpectedError | ReviewProgramErrors.NotFound | ReviewProgramErrors.Error | ReviewProgramErrors.Forbidden,
	Result<ReviewProgramDto>
>;

@Injectable()
export class UpdateReviewsProgramsUsecase implements IUseCase<UpdateReviewProgramDto, Promise<Response>> {
	constructor(@Inject('ReviewProgramRepository') public readonly repo: ReviewProgramRepository) {}

	async execute(dto: UpdateReviewProgramDto): Promise<Response> {
		const review = await this.repo.findOne({
			where: {
				id: dto.id,
			},
			relations: ['user', 'program'],
		});

		if (!review) {
			return left(new ReviewProgramErrors.NotFound());
		}

		if (!review.user.isAdmin() && !review.user.isMe(dto.userId)) {
			return left(new ReviewProgramErrors.Forbidden());
		}

		review.changeReview(dto.comment, dto.star);
		const entity = ReviewProgramMap.toEntity(review);
		entity.updatedBy = dto.userId;
		const domain = await this.repo.save(entity);

		return right(Result.ok(ReviewProgramMap.toDto(domain)));
	}
}
