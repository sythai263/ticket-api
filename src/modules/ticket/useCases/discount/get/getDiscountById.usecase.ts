import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { DiscountDto } from '../../../infrastructures/dtos/discount';
import { DiscountMap } from '../../../mapper';
import { DiscountRepository } from '../../../repositories';
import { DiscountErrors } from '../discount.error';

type Response = Either<
  AppError.UnexpectedError | DiscountErrors.NotFound | DiscountErrors.Error,
  Result<DiscountDto>
>;

@Injectable()
export class GetDiscountByIdUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('DiscountRepository') public readonly repo: DiscountRepository
	) { }

	async execute(id: number): Promise<Response> {

		const domain = await this.repo.findOne({
			where: { id },
			relations:['program']
		});
		if (!domain) {
			return left(new DiscountErrors.NotFound());
		}

		return right(Result.ok(DiscountMap.toDto(domain)));
	}

}
