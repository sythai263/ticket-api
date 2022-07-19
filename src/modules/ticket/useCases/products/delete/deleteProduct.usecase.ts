import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProductRepository } from '../../../repositories';
import { ProductErrors } from '../product.error';

type Response = Either<
  AppError.UnexpectedError | ProductErrors.Error| ProductErrors.NotFound,
  Result<boolean>
>;

@Injectable()
export class DeleteProductUsecase implements IUseCase<number, Promise<Response>> {
	constructor(@Inject('ProductRepository') public readonly repo: ProductRepository) {}

	async execute(id: number, userId: number): Promise<Response> {
		const domain = await this.repo.findById(id);
		if (!domain) {
			return left(new ProductErrors.NotFound());
		}

		const isSuccess = await this.repo.softDelete({ id }, userId);
		if (!isSuccess) {
			return left(new ProductErrors.Error('Can\'t delete this product!'));
		}

		return right(Result.ok(isSuccess));

	}

}
