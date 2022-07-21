import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { DiscountDomain, ProgramDomain } from '../../../domain';
import { DiscountEntity, ProgramEntity } from '../../../entities';
import { CreateDiscountDto, DiscountDto } from '../infrastructures/dtos/discount';
import { ProgramMap } from './program.mapper';

export class DiscountMap{

	static entityToDto(entity: DiscountEntity): DiscountDto {

		const dto = new DiscountDto();
		dto.id = entity.id;
		dto.code = entity.code;
		dto.program = ProgramMap.entityToDto(entity.program);
		dto.description = entity.description;
		dto.discount = entity.discount;
		dto.startDate = entity.startDate;
		dto.expiredDate = entity.expiredDate;
		return dto;
	}

	static dtoToEntity(dto: DiscountDto): DiscountEntity {
		const entity = new DiscountEntity();
		entity.id = dto.id;
		entity.code = dto.code;
		entity.program = ProgramMap.dtoToEntity(dto.program);
		entity.description = dto.description;
		entity.discount = dto.discount;
		entity.startDate = dto.startDate;
		entity.expiredDate = dto.expiredDate;
		return entity;
	}

	static createDtoToEntity(dto: CreateDiscountDto): DiscountEntity {
		const entity = new DiscountEntity();
		entity.code = dto.code;
		entity.program = new ProgramEntity(dto.programId);
		entity.description = dto.description;
		entity.discount = dto.discount;
		entity.startDate = dto.startDate;
		entity.expiredDate = dto.expiredDate;

		return entity;
	}

	static entityToDomain(entity: DiscountEntity): DiscountDomain {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const discountOrError = DiscountDomain.create(
			{
				discount: entity.discount,
				code: entity.code,
				description: entity.description,
				expiredDate: entity.expiredDate,
				startDate: entity.startDate,
				program: ProgramMap.entityToDomain(entity.program)
			},
			new UniqueEntityID(id),
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

	static toEntity(domain: DiscountDomain): DiscountEntity {
		const entity = new DiscountEntity();
		entity.id = domain.id.toValue();
		entity.program = ProgramMap.toEntity(domain.program);
		entity.code = domain.code;
		entity.description = domain.description;
		entity.discount = domain.discount;
		entity.startDate = domain.startDate;
		entity.expiredDate = domain.expiredDate;
		return entity;
	}

	static toDto(domain: DiscountDomain): DiscountDto {
		const dto = new DiscountDto();
		dto.id = domain.id.toValue();
		dto.program = ProgramMap.toDto(domain.program);
		dto.code = domain.code;
		dto.description = domain.description;
		dto.discount = domain.discount;
		dto.startDate = domain.startDate;
		dto.expiredDate = domain.expiredDate;

		return dto;
	}

	static toDtos(domains: DiscountDomain[]): DiscountDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: DiscountEntity[]): DiscountDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

	static dtoToDomain(dto: CreateDiscountDto): DiscountDomain{
		if (!dto) {
			return null;
		}

		const discountOrError = DiscountDomain.create(
			{
				discount: dto.discount,
				description: dto.description,
				expiredDate: dto.expiredDate,
				startDate: dto.startDate,
				code: dto.code,
				program : new ProgramDomain({}, new UniqueEntityID(dto.programId))
			}
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

}
