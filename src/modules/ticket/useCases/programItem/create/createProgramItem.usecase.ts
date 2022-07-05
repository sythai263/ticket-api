import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProgramItemDomain } from '../../../../../domain';
import { CreateProgramItemDto, ProgramItemDto } from '../../../infrastructures/dtos/programItem';
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
  Result<ProgramItemDto[]>
>;

@Injectable()
export class CreateProgramItemUsecase implements IUseCase<CreateProgramItemDto, Promise<Response>> {
	constructor(
		@Inject('ProgramItemRepository') public readonly repo: ProgramItemRepository,
		@Inject('ProgramRepository') public readonly programRepo: ProgramRepository,
		@Inject('ProductRepository') public readonly productRepo: ProductRepository
	) { }

	async execute(dto: CreateProgramItemDto, userId: number): Promise<Response> {

		const programDomain = await this.programRepo.findById(dto.programId);
		if (!programDomain) {
			return left(new ProgramErrors.NotFound());
		}

		const productDomains = await this.productRepo.findByIds(dto.productIds);
		if (!productDomains) {
			return left(new ProductErrors.NotFound());
		}

		const productItems = await this.repo.findBy({
			program: {
				id: dto.programId
			}
		});
		const newItems = productDomains.map(product => new ProgramItemDomain({
			product,
			program: programDomain
		}));

		let filterItems = new Array<ProgramItemDomain>();
		if (productItems.length === 0) {
			filterItems = newItems;
		} else {
			filterItems = newItems.filter(item => {
				const itemCheck = productItems.filter(product => !item.checkDuplicate(product));
				if (!itemCheck) {
					return true;
				}

				return false;
			});

			if (filterItems.length === 0) {
				return left(new ProgramItemErrors.Error('Duplicate program and products !'));
			}
		}

		const entities = filterItems.map(item => {
			const entity = ProgramItemMap.toEntity(item);
			entity.createdBy = userId;
			entity.updatedBy = userId;
			return entity;

		});

		const domains = await this.repo.saveMany(entities);
		return right(Result.ok(ProgramItemMap.toDtos(domains)));
	}

}
