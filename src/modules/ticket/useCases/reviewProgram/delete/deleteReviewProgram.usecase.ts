import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ReviewProgramRepository } from '../../../repositories';
import { ReviewProgramErrors } from '../reviewProgram.error';

type Response = Either<
	AppError.UnexpectedError | ReviewProgramErrors.Error | ReviewProgramErrors.NotFound,
	Result<boolean>
>;

@Injectable()
export class DeleteReviewProgramUsecase implements IUseCase<number, Promise<Response>> {
	constructor(@Inject('ReviewProgramRepository') public readonly repo: ReviewProgramRepository) {}

	async execute(id: number, userId: number): Promise<Response> {
		const domain = await this.repo.findOne({
			where: {
				id,
			},
			relations: ['user', 'program'],
		});
		if (!domain) {
			return left(new ReviewProgramErrors.NotFound());
		}

		if (!domain.user.isMe(userId)) {
			return left(new ReviewProgramErrors.Forbidden());
		}

		const isSuccess = await this.repo.delete({ id });
		if (!isSuccess) {
			return left(new ReviewProgramErrors.Error('Không thể xóa đánh giá này!'));
		}

		return right(Result.ok(isSuccess));
	}
}
