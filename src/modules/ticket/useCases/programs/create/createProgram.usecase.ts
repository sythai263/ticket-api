import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreateProgramDto } from '../../../infrastructures/dtos/program/createProgram.dto';
import { ProgramDto } from '../../../infrastructures/dtos/program/program.dto';
import { ProgramMap } from '../../../mapper/program.mapper';
import { ProgramRepository } from '../../../repositories/program.repo';
import { ProgramErrors } from '../program.error';

type Response = Either<
  AppError.UnexpectedError | ProgramErrors.NotFound | ProgramErrors.Error,
  Result<ProgramDto>
>;

@Injectable()
export class CreateProgramUsecase implements IUseCase<CreateProgramDto, Promise<Response>> {
	constructor(
		@Inject('ProgramRepository') public readonly repo: ProgramRepository
	) { }

	async execute(dto: CreateProgramDto, userId: number): Promise<Response> {

		const entity = ProgramMap.createDtoToEntity(dto);
		entity.createdBy = userId;
		entity.updatedBy = userId;
		const domain = await this.repo.save(entity);
		if (!domain) {
			return left(new ProgramErrors.Error('Can\'t create program !'));
		}

		return right(Result.ok(ProgramMap.toDto(domain)));
	}

}
