import { Inject, Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result } from '../../../../../core/logic/Result';
import { CreatePurchaseDto, PurchaseDto } from '../../../infrastructures/dtos/purchase';
import { DiscountRepository, ProductRepository, ProgramItemRepository } from '../../../repositories';
import { DiscountErrors } from '../../discount/discount.error';
import { PurchaseErrors } from '../purchase.error';

type Response = Either<
	AppError.UnexpectedError |
	DiscountErrors.NotFound |
	PurchaseErrors.Error |
	PurchaseErrors.NotFoundProducts,
  Result<PurchaseDto>
>;

@Injectable()
export class CreateOrderUsecase implements IUseCase<CreatePurchaseDto, Promise<Response>> {
	constructor(
		@Inject('ProductRepository') public readonly repo: ProductRepository,
		@Inject('DiscountRepository') public readonly discountRepo: DiscountRepository,
		@Inject('ProgramItemRepository') public readonly itemRepo: ProgramItemRepository
	) { }

	async execute(dto: CreatePurchaseDto, userId: number): Promise<Response> {

		const ids = dto.details.map((detail) => detail.productId);
		const products = await this.repo.find({
			where: {
				id: In(ids)
			}
		});

		const idsSearch = products.map((product) => product.id.toValue());

		const diff = ids.filter(id => !idsSearch.includes(id));
		if (diff.length > 0) {
			return left(new PurchaseErrors.NotFoundProducts(diff));
		}

		for (const product of products) {
			const quantity = dto.details.find(detail => detail.productId === product.id.toValue());
			product.buyAmount = quantity.amount;
		}

		const discount = await this.discountRepo.findOne({
			where: {
				code: dto.discountCode
			},
			relations:['program', 'program.items', 'program.items.product']
		});
		if (!discount) {
			return left(new DiscountErrors.NotFound(dto.discountCode));
		}

		return null;
	}
}
