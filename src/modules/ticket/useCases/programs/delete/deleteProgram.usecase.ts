import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProgramRepository } from '../../../repositories';
import { ProgramErrors } from '../program.error';

type Response = Either<
  AppError.UnexpectedError | ProgramErrors.Error| ProgramErrors.NotFound,
  Result<boolean>
>;

@Injectable()
export class DeleteProgramUsecase implements IUseCase<number, Promise<Response>> {
	constructor(@Inject('ProgramRepository') public readonly repo: ProgramRepository) {}

	async execute(id: number, userId: number): Promise<Response> {
		const domain = await this.repo.findById(id);
		if (!domain) {
			return left(new ProgramErrors.NotFound());
		}

		const isSuccess = await this.repo.softDelete({ id }, userId);
		if (!isSuccess) {
			return left(new ProgramErrors.Error('Can\'t delete this program !'));
		}

		return right(Result.ok(isSuccess));

	}

}
