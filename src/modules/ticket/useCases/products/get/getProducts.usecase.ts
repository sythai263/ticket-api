import { Inject, Injectable } from '@nestjs/common';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { PaginationProductDto } from '../../../infrastructures/dtos/product';
import { SearchProgramDto } from '../../../infrastructures/dtos/program';
import { ProductMap } from '../../../mapper';
import { ProductRepository } from '../../../repositories';
import { ProductErrors } from '../product.error';

type Response = Either<
	AppError.UnexpectedError | ProductErrors.NotFound | ProductErrors.Error,
	Result<PaginationProductDto>
>;

@Injectable()
export class GetProductsUsecase implements IUseCase<SearchProgramDto, Promise<Response>> {
	constructor(@Inject('ProductRepository') public readonly repo: ProductRepository) {}

	async execute(dto: SearchProgramDto): Promise<Response> {
		const result = await this.repo.search(dto);
		if (!result) {
			return left(new ProductErrors.Error('Không có kết quả phù hợp'));
		}

		const meta = new PageMetaDto(dto, result[1]);
		const data = ProductMap.toDtos(result[0]);
		const response = new PaginationProductDto(data, meta);
		return right(Result.ok(response));
	}
}
