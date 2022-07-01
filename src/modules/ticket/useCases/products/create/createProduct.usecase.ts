import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, Result, right } from '../../../../../core/logic/Result';
import { CreateProductDto, ProductDto } from '../../../infrastructures/dtos/product';
import { ProductMap } from '../../../mapper';
import { ProductRepository } from '../../../repositories';
import { ProductErrors } from '../product.error';

type Response = Either<
  AppError.UnexpectedError | ProductErrors.NotFound | ProductErrors.Error,
  Result<ProductDto>
>;

@Injectable()
export class CreateProductUsecase implements IUseCase<CreateProductDto, Promise<Response>> {
	constructor(
		@Inject('ProductRepository') public readonly repo: ProductRepository
	) { }

	async execute(dto: CreateProductDto, userId: number): Promise<Response> {

		const entity = ProductMap.createDtoToEntity(dto);
		entity.createdBy = userId;
		entity.updatedBy = userId;
		const domain = await this.repo.save(entity);

		return right(Result.ok(ProductMap.toDto(domain)));
	}

}
