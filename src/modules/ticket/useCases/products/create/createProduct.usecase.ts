import { Inject, Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, Result, right } from '../../../../../core/logic/Result';
import { CreateProductDto, ProductDto } from '../../../infrastructures/dtos/product';
import { ImageMap, ProductMap } from '../../../mapper';
import { ImageRepository, ProductRepository } from '../../../repositories';
import { ProductErrors } from '../product.error';

type Response = Either<
  AppError.UnexpectedError | ProductErrors.NotFound | ProductErrors.Error,
  Result<ProductDto>
>;

@Injectable()
export class CreateProductUsecase implements IUseCase<CreateProductDto, Promise<Response>> {
	constructor(
		@Inject('ProductRepository') public readonly repo: ProductRepository,
		@Inject('ImageRepository') public readonly imageRepo: ImageRepository
	) { }

	async execute(dto: CreateProductDto, userId: number): Promise<Response> {

		const entity = ProductMap.createDtoToEntity(dto);
		entity.createdBy = userId;
		entity.updatedBy = userId;
		const domain = await this.repo.save(entity);
		const images = await this.imageRepo.find({
			where: { id: In(dto.images) }
		});

		for (const image of images) {
			image.product = domain;
		}

		const imageEntities = ImageMap.toEntities(images);
		await this.imageRepo.saveMany(imageEntities);
		return right(Result.ok(ProductMap.createDomainToDto(domain)));
	}

}
