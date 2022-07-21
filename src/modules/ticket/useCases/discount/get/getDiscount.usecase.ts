import { Inject, Injectable } from '@nestjs/common';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { PaginationDiscountDto, SearchDiscountDto } from '../../../infrastructures/dtos/discount';
import { DiscountMap } from '../../../mapper';
import { DiscountRepository } from '../../../repositories';
import { DiscountErrors } from '../discount.error';

type Response = Either<
	AppError.UnexpectedError |
	DiscountErrors.NotFound |
	DiscountErrors.Error ,
  Result<PaginationDiscountDto>
>;

@Injectable()
export class GetDiscountUsecase implements IUseCase<SearchDiscountDto, Promise<Response>> {
	constructor(
		@Inject('DiscountRepository') public readonly repo: DiscountRepository,
	) { }

	async execute(dto: SearchDiscountDto, userId?: number): Promise<Response> {
		const result = await this.repo.search(dto);
		if (!result) {
			return left(new DiscountErrors.Error('Không có mã giảm giá phù hợp !'));
		}

		const meta = new PageMetaDto(dto, result[1]);
		const data = DiscountMap.toDtos(result[0]);
		const response = new PaginationDiscountDto(data, meta);
		return right(Result.ok(response));
	}

}
