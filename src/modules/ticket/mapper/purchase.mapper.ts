import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { PurchaseDomain, UserDomain } from '../../../domain';
import { PurchaseEntity, UserEntity } from '../../../entities';
import { CreatePurchaseDto, PurchaseDto } from '../infrastructures/dtos/purchase';
import { InvoiceMap } from './invoice.mapper';
import { UserMap } from './user.mapper';

export class PurchaseMap{

	static entityToDto(entity: PurchaseEntity): PurchaseDto {

		const dto = new PurchaseDto();
		dto.id = entity.id;
		dto.invoice = InvoiceMap.entityToDto(entity.invoice);
		dto.user = UserMap.entityToDto(entity.user);
		dto.orderDate = entity.orderDate;
		return dto;
	}

	static dtoToEntity(dto: PurchaseDto): PurchaseEntity {
		const entity = new PurchaseEntity();
		entity.id = dto.id;
		entity.user = UserMap.dtoToEntity(dto.user);
		entity.invoice = InvoiceMap.dtoToEntity(dto.invoice);
		entity.orderDate = dto.orderDate;
		return entity;
	}

	static createDtoToEntity(dto: CreatePurchaseDto): PurchaseEntity {
		const entity = new PurchaseEntity();
		entity.user = new UserEntity(dto.userId);
		return entity;
	}

	static entityToDomain(entity: PurchaseEntity): PurchaseDomain {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const discountOrError = PurchaseDomain.create(
			{
				user: UserMap.entityToDomain(entity.user),
				invoice: InvoiceMap.entityToDomain(entity.invoice),
				orderDate: entity.orderDate
			},
			new UniqueEntityID(id),
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

	static toEntity(domain: PurchaseDomain): PurchaseEntity {
		const entity = new PurchaseEntity();
		entity.id = domain.id.toValue();
		entity.user = UserMap.toEntity(domain.user);
		entity.invoice = InvoiceMap.toEntity(domain.invoice);
		entity.orderDate = domain.orderDate;
		return entity;
	}

	static toDto(domain: PurchaseDomain): PurchaseDto {
		const dto = new PurchaseDto();
		dto.id = domain.id.toValue();
		dto.user = UserMap.toDto(domain.user);
		dto.invoice = InvoiceMap.toDto(domain.invoice);
		dto.orderDate = domain.orderDate;

		return dto;
	}

	static toDtos(domains: PurchaseDomain[]): PurchaseDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: PurchaseEntity[]): PurchaseDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

	static dtoToDomain(dto: CreatePurchaseDto): PurchaseDomain{
		if (!dto) {
			return null;
		}

		const discountOrError = PurchaseDomain.create(
			{
				user: new UserDomain({}, new UniqueEntityID(dto.userId))
			}
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

}
