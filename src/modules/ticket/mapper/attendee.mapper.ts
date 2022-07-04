import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { AttendeeDomain, ProgramDomain, UserDomain } from '../../../domain';
import { AttendeeEntity, ProgramEntity, UserEntity } from '../../../entities';
import { AttendeeDto, CreateAttendeeDto } from '../infrastructures/dtos/attendee';
import { InvoiceMap } from './invoice.mapper';
import { ProgramMap } from './program.mapper';
import { UserMap } from './user.mapper';

export class AttendeeMap{

	static entityToDto(entity: AttendeeEntity): AttendeeDto {

		const dto = new AttendeeDto();
		dto.id = entity.id;
		dto.program = ProgramMap.entityToDto(entity.program);
		dto.user = UserMap.entityToDto(entity.user);
		if (entity.invoice) {
			dto.invoice = InvoiceMap.entityToDto(entity.invoice);
		}

		return dto;
	}

	static dtoToEntity(dto: AttendeeDto): AttendeeEntity {
		const entity = new AttendeeEntity();
		entity.id = dto.id;
		entity.program = ProgramMap.dtoToEntity(dto.program);
		entity.user = UserMap.dtoToEntity(dto.user);
		if (entity.invoice) {
			entity.invoice = InvoiceMap.dtoToEntity(entity.invoice);
		}

		return entity;
	}

	static createDtoToEntity(dto: CreateAttendeeDto): AttendeeEntity {
		const entity = new AttendeeEntity();
		entity.program = new ProgramEntity(dto.programId);
		entity.user = new UserEntity(dto.userId);

		return entity;
	}

	static entityToDomain(entity: AttendeeEntity): AttendeeDomain {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const discountOrError = AttendeeDomain.create(
			{
				user: UserMap.entityToDomain(entity.user),
				program: ProgramMap.entityToDomain(entity.program),
				invoice: InvoiceMap.entityToDomain(entity.invoice)
			},
			new UniqueEntityID(id),
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

	static toEntity(domain: AttendeeDomain): AttendeeEntity {
		const entity = new AttendeeEntity();
		entity.id = domain.id.toValue();
		entity.program = ProgramMap.toEntity(domain.program);
		entity.user = UserMap.toEntity(domain.user);
		entity.invoice = InvoiceMap.toEntity(domain.invoice);
		return entity;
	}

	static toDto(domain: AttendeeDomain): AttendeeDto {
		const dto = new AttendeeDto();
		dto.id = domain.id.toValue();
		dto.program = ProgramMap.toDto(domain.program);
		dto.user = UserMap.toDto(domain.user);
		dto.invoice = InvoiceMap.toDto(domain.invoice);

		return dto;
	}

	static toDtos(domains: AttendeeDomain[]): AttendeeDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: AttendeeEntity[]): AttendeeDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

	static dtoToDomain(dto: CreateAttendeeDto): AttendeeDomain{
		if (!dto) {
			return null;
		}

		const discountOrError = AttendeeDomain.create(
			{
				user: new UserDomain({}, new UniqueEntityID(dto.userId)),
				program : new ProgramDomain({}, new UniqueEntityID(dto.programId))
			}
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

}
