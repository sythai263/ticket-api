import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProductRepository, ProgramItemRepository, ProgramRepository } from '../../../repositories';
import { ProgramErrors } from '../../programs';

type Response = Either<
  AppError.UnexpectedError | ProgramErrors.Error| ProgramErrors.NotFound,
  Result<boolean>
>;

@Injectable()
export class DeleteProgramItemByProgramIdUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('ProgramItemRepository') public readonly repo: ProgramItemRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
		@Inject('ProductRepository') public readonly productRepo: ProductRepository
	) { }

	async execute(programId: number, userId: number): Promise<Response> {
		const domains = await this.repo.findBy({
			program: {
				id: programId
			}
		});
		if (!domains) {
			return left(new ProgramErrors.NotFound());
		}

		const ids = domains.map(domain => domain.id.toValue());

		const isSuccess = await this.repo.delete(ids, userId);
		if (!isSuccess) {
			return left(new ProgramErrors.Error('Can\'t delete this product!'));
		}

		return right(Result.ok(isSuccess));

	}

}
