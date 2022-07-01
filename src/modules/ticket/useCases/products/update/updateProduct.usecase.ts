import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProductDomain } from '../../../../../domain';
import { CreateProductDto, ProductDto, UpdateProductDto } from '../../../infrastructures/dtos/product';
import { ProductMap } from '../../../mapper';
import { ProductRepository } from '../../../repositories';
import { ProductErrors } from '../product.error';

type Response = Either<
  AppError.UnexpectedError | ProductErrors.NotFound | ProductErrors.Error,
  Result<ProductDto>
>;

@Injectable()
export class UpdateProductUsecase implements IUseCase<CreateProductDto, Promise<Response>> {
	constructor(
		@Inject('ProductRepository') public readonly repo: ProductRepository
	) { }

	async execute(dto: UpdateProductDto, userId: number): Promise<Response> {

		let domain = await this.repo.findById(dto.id);
		if (!domain) {
			return left(new ProductErrors.NotFound());
		}

		domain = this.changeProduct(domain, dto);
		const entity = ProductMap.toEntity(domain);
		domain = await this.repo.save(entity);
		return right(Result.ok(ProductMap.toDto(domain)));
	}

	changeProduct(domain: ProductDomain, dto: UpdateProductDto): ProductDomain {
		domain.changeAvatar(dto.avatar);
		domain.changeDescription(dto.description);
		domain.changeName(dto.name);
		domain.changePrice(dto.price);
		domain.changeTotal(dto.total);
		return domain;
	}
}
