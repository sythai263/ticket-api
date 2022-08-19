import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { SaleProgramDto } from '../../../infrastructures/dtos/program';
import { ProgramMap } from '../../../mapper/program.mapper';
import { ProgramRepository } from '../../../repositories/program.repo';
import { ProgramErrors } from '../program.error';

type Response = Either<AppError.UnexpectedError | ProgramErrors.NotFound | ProgramErrors.Error, Result<SaleProgramDto>>;

@Injectable()
export class GetSaleProgramUsecase implements IUseCase<number, Promise<Response>> {
	constructor(@Inject('ProgramRepository') public readonly repo: ProgramRepository) {}

	async execute(id: number): Promise<Response> {
		const domain = await this.repo.findOne({
			where: {
				id,
			},
			relations: ['attendees', 'reviewedPrograms', 'attendees.invoice'],
		});
		if (!domain) {
			return left(new ProgramErrors.NotFound());
		}

		return right(Result.ok(ProgramMap.toSaleProgram(domain)));
	}
}
