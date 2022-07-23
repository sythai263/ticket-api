import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { DetailOrderDomain } from '../../../domain';
import { DetailOrderEntity, ProductEntity } from '../../../entities';
import { CreateDetailOrderDto, DetailOrderDto } from '../infrastructures/dtos/detailOrder';
import { DiscountMap } from './discount.mapper';
import { ProductMap } from './product.mapper';
import { PurchaseMap } from './purchase.mapper';

export class DetailOrderMap{

	static entityToDto(entity: DetailOrderEntity): DetailOrderDto {

		const dto = new DetailOrderDto();
		dto.id = entity.id;
		dto.amount = entity.amount;
		dto.discount = DiscountMap.entityToDto(entity.discount);
		dto.product = ProductMap.entityToDto(entity.product);
		return dto;
	}

	static dtoToEntity(dto: DetailOrderDto): DetailOrderEntity {
		const entity = new DetailOrderEntity();
		entity.id = dto.id;
		entity.amount = dto.amount;
		entity.discount = DiscountMap.dtoToEntity(dto.discount);
		entity.product = ProductMap.dtoToEntity(dto.product);
		return entity;
	}

	static createDtoToEntity(dto: CreateDetailOrderDto): DetailOrderEntity {
		const entity = new DetailOrderEntity();
		entity.product = new ProductEntity(dto.productId);
		entity.amount = dto.amount;
		return entity;
	}

	static entityToDomain(entity: DetailOrderEntity): DetailOrderDomain {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const discountOrError = DetailOrderDomain.create(
			{
				product: ProductMap.entityToDomain(entity.product),
				discount: DiscountMap.entityToDomain(entity.discount),
				amount : entity.amount
			},
			new UniqueEntityID(id),
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

	static toEntity(domain: DetailOrderDomain): DetailOrderEntity {
		const entity = new DetailOrderEntity();
		entity.id = domain.id.toValue();
		entity.product = ProductMap.toEntity(domain.product);
		entity.purchase = PurchaseMap.toEntity(domain.purchase);
		if (domain.discount) {
			entity.discount = DiscountMap.toEntity(domain.discount);
		}

		entity.amount = domain.amount;
		return entity;
	}

	static toDto(domain: DetailOrderDomain): DetailOrderDto {
		const dto = new DetailOrderDto();
		dto.id = domain.id.toValue();
		dto.product = ProductMap.toDto(domain.product);
		dto.amount = domain.amount;
		if (dto.discount) {
			dto.discount = DiscountMap.toDto(domain.discount);
		}

		dto.discountAmount = domain.discountAmount;
		dto.summary = domain.summary;
		dto.total = domain.total;
		return dto;
	}

	static toDtos(domains: DetailOrderDomain[]): DetailOrderDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static toEntities(domains: DetailOrderDomain[]): DetailOrderEntity[] {
		if (domains) {
			const entities = domains.map((domain) => this.toEntity(domain));
			return entities;
		}

		return null;
	}

	static entitiesToDomains(entities: DetailOrderEntity[]): DetailOrderDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

}
