import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { ProgramItemDomain } from '../../../domain';
import { ProductEntity, ProgramEntity, ProgramItemEntity } from '../../../entities';
import { CreateProgramItemDto, ProgramItemDto } from '../infrastructures/dtos/programItem';
import { ProductMap } from './product.mapper';
import { ProgramMap } from './program.mapper';

export class ProgramItemMap{

	static entityToDto(entity: ProgramItemEntity): ProgramItemDto {

		const dto = new ProgramItemDto();
		dto.id = entity.id;
		dto.program = ProgramMap.entityToDto(entity.program);
		dto.product = ProductMap.entityToDto(entity.product);
		return dto;
	}

	static dtoToEntity(dto: ProgramItemDto): ProgramItemEntity {
		const entity = new ProgramItemEntity();
		entity.id = dto.id;
		entity.program = ProgramMap.dtoToEntity(dto.program);
		entity.product = ProductMap.dtoToEntity(dto.product);
		return entity;
	}

	static createDtoToEntity(dto: CreateProgramItemDto): ProgramItemEntity {
		const entity = new ProgramItemEntity();
		entity.program = new ProgramEntity(dto.programId);
		entity.product = new ProductEntity(dto.programId);

		return entity;
	}

	static entityToDomain(entity: ProgramItemEntity): ProgramItemDomain {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const discountOrError = ProgramItemDomain.create(
			{
				program: ProgramMap.entityToDomain(entity.program),
				product: ProductMap.entityToDomain(entity.product)
			},
			new UniqueEntityID(id),
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

	static toEntity(domain: ProgramItemDomain): ProgramItemEntity {
		const entity = new ProgramItemEntity();
		entity.id = domain.id.toValue();
		entity.program = ProgramMap.toEntity(domain.program);
		entity.product = ProductMap.toEntity(domain.product);
		return entity;
	}

	static toDto(domain: ProgramItemDomain): ProgramItemDto {
		const dto = new ProgramItemDto();
		dto.id = domain.id.toValue();
		dto.program = ProgramMap.toDto(domain.program);
		dto.product = ProductMap.toDto(domain.product);

		return dto;
	}

	static toDtos(domains: ProgramItemDomain[]): ProgramItemDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: ProgramItemEntity[]): ProgramItemDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

}
