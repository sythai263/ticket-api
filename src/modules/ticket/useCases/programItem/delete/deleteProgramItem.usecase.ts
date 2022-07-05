import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProductRepository, ProgramItemRepository, ProgramRepository } from '../../../repositories';
import { ProgramItemErrors } from '../programItem.error';

type Response = Either<
  AppError.UnexpectedError | ProgramItemErrors.Error| ProgramItemErrors.NotFound,
  Result<boolean>
>;

@Injectable()
export class DeleteProgramItemUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('ProgramItemRepository') public readonly repo: ProgramItemRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
		@Inject('ProductRepository') public readonly productRepo: ProductRepository
	) { }

	async execute(id: number, userId: number): Promise<Response> {
		const domains = await this.repo.findById(id);
		if (!domains) {
			return left(new ProgramItemErrors.NotFound());
		}

		const isSuccess = await this.repo.delete(id, userId);
		if (!isSuccess) {
			return left(new ProgramItemErrors.Error('Can\'t delete this product!'));
		}

		return right(Result.ok(isSuccess));

	}

}
