import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { ProgramDomain } from '../../../domain/program.domain';
import { ProgramEntity } from '../../../entities/program.entity';
import { CreateProgramDto } from '../infrastructures/dtos/program/createProgram.dto';
import { ProgramDto } from '../infrastructures/dtos/program/program.dto';

export class ProgramMap {
	static entityToDto(entity: ProgramEntity): ProgramDto {
		const dto = new ProgramDto();
		dto.id = entity.id;
		dto.total = entity.total;
		dto.avatar = entity.avatar;
		dto.price = entity.price;
		dto.avatar = entity.avatar;
		dto.startDate = entity.startDate;
		dto.endDate = entity.endDate;
		dto.name = entity.name;
		dto.remain = entity.total;
		dto.description = entity.description;
		return dto;
	}

	static dtoToEntity(dto: ProgramDto): ProgramEntity {
		const entity = new ProgramEntity();
		entity.total = dto.total;
		entity.avatar = dto.avatar;
		entity.price = dto.price;
		entity.avatar = dto.avatar;
		entity.startDate = dto.startDate;
		entity.endDate = dto.endDate;
		entity.name = dto.name;
		entity.description = dto.description;

		return entity;
	}

	static createDtoToEntity(dto: CreateProgramDto): ProgramEntity {
		const entity = new ProgramEntity();
		entity.total = dto.total;
		entity.avatar = dto.avatar;
		entity.price = dto.price;
		entity.avatar = dto.avatar;
		entity.startDate = dto.startDate;
		entity.endDate = dto.endDate;
		entity.name = dto.name;
		entity.description = dto.description;
		return entity;
	}

	static entityToDomain(entity: ProgramEntity) {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const programOrError = ProgramDomain.create(
			{
				total: entity.total,
				avatar: entity.avatar,
				description: entity.description,
				endDate: entity.endDate,
				startDate: entity.startDate,
				name: entity.name,
				price: entity.price
			},
			new UniqueEntityID(id),
		);
		return programOrError.isSuccess ? programOrError.getValue() : null;
	}

	static toEntity(domain: ProgramDomain): ProgramEntity {
		const entity = new ProgramEntity();
		entity.id = domain.id.toValue();
		entity.total = domain.total;
		entity.avatar = domain.avatar;
		entity.price = domain.price;
		entity.avatar = domain.avatar;
		entity.startDate = domain.startDate;
		entity.endDate = domain.endDate;
		entity.name = domain.name;
		entity.description = domain.description;
		return entity;
	}

	static toDto(domain: ProgramDomain): ProgramDto {
		const dto = new ProgramDto();
		dto.id = domain.id.toValue();
		dto.total = domain.total;
		dto.avatar = domain.avatar;
		dto.price = domain.price;
		dto.avatar = domain.avatar;
		dto.startDate = domain.startDate;
		dto.endDate = domain.endDate;
		dto.name = domain.name;
		dto.remain = domain.remain;
		dto.description = domain.description;

		return dto;
	}

	static toDtos(domains: ProgramDomain[]): ProgramDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: ProgramEntity[]): ProgramDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

	static dtoToDomain(dto: CreateProgramDto): ProgramDomain{
		if (!dto) {
			return null;
		}

		const programOrError = ProgramDomain.create(
			{
				total: dto.total,
				avatar: dto.avatar,
				description: dto.description,
				endDate: dto.endDate,
				startDate: dto.startDate,
				name: dto.name,
				price: dto.price
			}
		);
		return programOrError.isSuccess ? programOrError.getValue() : null;
	}

}
