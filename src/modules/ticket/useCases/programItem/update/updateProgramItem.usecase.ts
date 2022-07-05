import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProgramItemDto, UpdateProgramItemDto } from '../../../infrastructures/dtos/programItem';
import { ProgramItemMap } from '../../../mapper';
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
  Result<ProgramItemDto>
>;

@Injectable()
export class UpdateProgramItemUsecase implements IUseCase<UpdateProgramItemDto, Promise<Response>> {
	constructor(
		@Inject('ProgramItemRepository') public readonly repo: ProgramItemRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
		@Inject('ProductRepository') public readonly productRepo: ProductRepository
	) { }

	async execute(dto: UpdateProgramItemDto, userId: number): Promise<Response> {

		const programDomain = await this.programRepo.findById(dto.programId);
		if (!programDomain) {
			return left(new ProgramErrors.NotFound());
		}

		const productDomain = await this.productRepo.findById(dto.productId);
		if (!productDomain) {
			return left(new ProductErrors.NotFound());
		}

		const item = await this.repo.findById(dto.id);
		if (!item) {
			return left(new ProgramItemErrors.NotFound());
		}

		item.product = productDomain;
		item.program = programDomain;

		const entity = ProgramItemMap.toEntity(item);
		entity.createdBy = userId;
		entity.updatedBy = userId;

		const domain = await this.repo.save(entity);
		return right(Result.ok(ProgramItemMap.toDto(domain)));
	}

}
