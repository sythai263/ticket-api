import { Inject, Injectable } from '@nestjs/common';

import { ModeImage } from '../../../../../common/constants/modeImage';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { saveImage } from '../../../../../utils/saveImage';
import { ProductDto } from '../../../infrastructures/dtos/product';
import { ProductMap } from '../../../mapper';
import { ProductRepository } from '../../../repositories';
import { ProductErrors } from '../product.error';

type Response = Either<
  AppError.UnexpectedError | ProductErrors.NotFound,
  Result<ProductDto>
>;

@Injectable()
export class ChangeAvatarProductUseCase implements IUseCase<Express.Multer.File, Promise<Response>> {
	constructor(@Inject('ProductRepository') public readonly repo: ProductRepository) {}

	async execute(avatar: Express.Multer.File, userId: number): Promise<Response> {
		const product = await this.repo.findById(userId);
		if (!product) {
			return left(new ProductErrors.NotFound());
		}

		const url = await saveImage(avatar, ModeImage.PRODUCT);
		product.avatar = url;
		const entity = ProductMap.toEntity(product);
		entity.updatedBy = userId;
		await this.repo.save(entity);
		return right(Result.ok(ProductMap.toDto(product)));

	}

}
