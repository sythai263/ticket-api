import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProductDto } from '../../../infrastructures/dtos/product';
import { ProductMap } from '../../../mapper';
import { ProductRepository } from '../../../repositories';
import { ProductErrors } from '../product.error';

type Response = Either<
  AppError.UnexpectedError | ProductErrors.NotFound | ProductErrors.Error,
  Result<ProductDto>
>;

@Injectable()
export class GetProductByIdUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('ProductRepository') public readonly repo: ProductRepository
	) { }

	async execute(id: number): Promise<Response> {

		const domain = await this.repo.findOne({
			where: { id },
			relations:['reviewedProducts', 'reviewedProducts.user', 'detail']
		});
		if (!domain) {
			return left(new ProductErrors.NotFound());
		}

		return right(Result.ok(ProductMap.toDtoReview(domain)));
	}

}
