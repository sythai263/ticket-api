import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { DiscountDomain, ProgramDomain } from '../../../../../domain';
import { DiscountDto, UpdateDiscountDto } from '../../../infrastructures/dtos/discount';
import { DiscountMap } from '../../../mapper';
import { DiscountRepository, ProgramRepository } from '../../../repositories';
import { ProgramErrors } from '../../programs';
import { DiscountErrors } from '../discount.error';

type Response = Either<
	AppError.UnexpectedError |
	DiscountErrors.NotFound |
	ProgramErrors.NotFound|
	DiscountErrors.Error,
  Result<DiscountDto>
>;

@Injectable()
export class UpdateDiscountUsecase implements IUseCase<UpdateDiscountDto, Promise<Response>> {
	constructor(
				@Inject('DiscountRepository') public readonly repo: DiscountRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
	) { }

	async execute(dto: UpdateDiscountDto, userId: number): Promise<Response> {

		let domain = await this.repo.findById(dto.id);
		if (!domain) {
			return left(new DiscountErrors.NotFound());
		}

		const program = await this.programRepo.findById(dto.programId);

		if (!program) {
			return left(new ProgramErrors.NotFound());
		}

		domain = this.changeDiscount(domain, dto);
		const entity = DiscountMap.toEntity(domain);
		domain = await this.repo.save(entity);
		return right(Result.ok(DiscountMap.toDto(domain)));
	}

	changeDiscount(domain: DiscountDomain, dto: UpdateDiscountDto, program?: ProgramDomain): DiscountDomain {
		domain.changeCode(dto.code);
		domain.changeProgram(program);
		domain.changeStartDate(dto.startDate);
		domain.changeExpiredDate(dto.expiredDate);
		domain.changeDescription(dto.description);
		domain.changeDiscount(dto.discount);

		return domain;
	}
}
