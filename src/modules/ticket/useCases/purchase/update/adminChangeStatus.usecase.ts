import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { PurchaseDto } from '../../../infrastructures/dtos/purchase';
import { PurchaseMap } from '../../../mapper';
import { PurchaseRepository } from '../../../repositories';
import { PurchaseErrors } from '../purchase.error';

type Response = Either<
  AppError.UnexpectedError | PurchaseErrors.NotFound | PurchaseErrors.Error,
  Result<PurchaseDto>
>;

@Injectable()
export class ChangeStatusOrderUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('PurchaseRepository') public readonly repo: PurchaseRepository
	) { }

	async execute(id: number, userId: number): Promise<Response> {
		const domain = await this.repo.getDetails(id);

		if (!domain) {
			return left(new PurchaseErrors.NotFound(id));
		}

		domain.changeStatus();
		const entity = PurchaseMap.toEntity(domain);
		entity.updatedBy = userId;
		await this.repo.save(entity);

		return right(Result.ok(PurchaseMap.toDto(domain)));
	}

}
