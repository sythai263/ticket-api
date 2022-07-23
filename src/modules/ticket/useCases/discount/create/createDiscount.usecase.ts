import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreateDiscountDto, DiscountDto } from '../../../infrastructures/dtos/discount';
import { DiscountMap } from '../../../mapper';
import { DiscountRepository, ProgramRepository } from '../../../repositories';
import { ProgramErrors } from '../../programs';
import { DiscountErrors } from '../discount.error';

type Response = Either<
	AppError.UnexpectedError |
	ProgramErrors.NotFound |
	DiscountErrors.NotFound |
	DiscountErrors.Error ,
  Result<DiscountDto>
>;

@Injectable()
export class CreateDiscountUsecase implements IUseCase<CreateDiscountDto, Promise<Response>> {
	constructor(
		@Inject('DiscountRepository') public readonly repo: DiscountRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
	) { }

	async execute(dto: CreateDiscountDto, userId: number): Promise<Response> {

		const program = await this.programRepo.findById(dto.programId);
		if (!program) {
			return left(new ProgramErrors.NotFound());
		}

		const discount = DiscountMap.dtoToDomain(dto);
		if (!discount.validate()) {
			return left(new DiscountErrors.Error('Ngày bắt đầu và kết thúc của mã giảm giá không hợp lệ !'));
		}

		discount.program = program;
		const entity = DiscountMap.toEntity(discount);
		entity.createdBy = userId;
		entity.updatedBy = userId;
		const domain = await this.repo.save(entity);
		if (domain) {
			return right(Result.ok(DiscountMap.toDto(domain)));
		}

		return left(new AppError.UnexpectedError('Lỗi khi lưu dữ liệu !'));

	}
}
