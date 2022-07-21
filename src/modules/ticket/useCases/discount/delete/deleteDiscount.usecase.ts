import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { DiscountRepository } from '../../../repositories';
import { DiscountErrors } from '../discount.error';

type Response = Either<
  AppError.UnexpectedError | DiscountErrors.Error| DiscountErrors.NotFound,
  Result<boolean>
>;

@Injectable()
export class DeleteDiscountUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('DiscountRepository') public readonly repo: DiscountRepository,
	) { }

	async execute(id: number, userId: number): Promise<Response> {
		const domain = await this.repo.findById(id);
		if (!domain) {
			return left(new DiscountErrors.NotFound());
		}

		if (domain.canUpdateOrDelete()) {
			return left(new DiscountErrors.Error('Không thể xóa mã giảm giá này'));
		}

		const isSuccess = await this.repo.softDelete({ id }, userId);
		if (!isSuccess) {
			return left(new DiscountErrors.Error('Không thể xóa mã giảm giá này'));
		}

		return right(Result.ok(isSuccess));

	}

}
