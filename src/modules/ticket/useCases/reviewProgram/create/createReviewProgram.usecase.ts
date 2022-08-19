import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreateReviewProgramDto, ReviewProgramDto } from '../../../infrastructures/dtos/reviewProgram';
import { ReviewProgramMap } from '../../../mapper';
import { AttendeeRepository, ProgramRepository, ReviewProgramRepository } from '../../../repositories';
import { ProgramErrors } from '../../programs';
import { ReviewProgramErrors } from '../reviewProgram.error';

type Response = Either<
	AppError.UnexpectedError | ReviewProgramErrors.NotFound | ReviewProgramErrors.Error,
	Result<ReviewProgramDto>
>;

@Injectable()
export class CreateReviewsProgramsUsecase implements IUseCase<CreateReviewProgramDto, Promise<Response>> {
	constructor(
		@Inject('ReviewProgramRepository') public readonly repo: ReviewProgramRepository,
		@Inject('AttendeeRepository') public readonly attendeeRepo: AttendeeRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
	) {}

	async execute(dto: CreateReviewProgramDto): Promise<Response> {
		const programPromise = this.programRepo.findById(dto.programId);

		const attendeePromise = this.attendeeRepo.findOneBy({
			user: {
				id: dto.userId,
			},
			program: {
				id: dto.programId,
			},
		});

		const reviewPromise = this.repo.findOneBy({
			user: {
				id: dto.userId,
			},
			program: {
				id: dto.programId,
			},
		});
		const [program, attendee, review] = await Promise.all([programPromise, attendeePromise, reviewPromise]);
		if (!program) {
			return left(new ProgramErrors.NotFound());
		}

		if (!attendee) {
			return left(new ReviewProgramErrors.Error('Bạn phải tham gia sự kiên thì mới có thể đánh giá được !'));
		}

		if (review) {
			return left(new ReviewProgramErrors.Error('Chỉ đánh giá sự kiện này 1 lần ! Bạn đã đánh giá rồi !'));
		}

		const entity = ReviewProgramMap.createDtoToEntity(dto);
		const domain = await this.repo.save(entity);

		return right(Result.ok(ReviewProgramMap.toDto(domain)));
	}
}
