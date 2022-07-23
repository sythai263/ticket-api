import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProgramItemsDto } from '../../../infrastructures/dtos/programItem';
import { ProgramMap } from '../../../mapper';
import { ProductRepository, ProgramItemRepository, ProgramRepository } from '../../../repositories';
import { ProductErrors } from '../../products';
import { ProgramErrors } from '../../programs';
import { ProgramItemErrors } from '../programItem.error';

type Response = Either<
	AppError.UnexpectedError |
	ProgramItemErrors.NotFound |
	ProgramItemErrors.Error |
	ProductErrors.NotFound |
	ProgramErrors.NotFound,
  Result<ProgramItemsDto>
>;

@Injectable()
export class GetProgramItemUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('ProgramItemRepository') public readonly repo: ProgramItemRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
		@Inject('ProductRepository') public readonly productRepo: ProductRepository
	) { }

	async execute(programId: number, userId?: number): Promise<Response> {

		const programDomain = await this.programRepo.getProducts(programId);
		if (programDomain) {
			return right(Result.ok(ProgramMap.toProgramItemDto(programDomain)));
		}

		return left(new ProgramErrors.NotFound());
	}

}
