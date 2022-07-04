import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { DetailOrderDomain } from '../../../domain';
import { DetailOrderEntity, DiscountEntity, ProductEntity } from '../../../entities';
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
		dto.purchase = PurchaseMap.entityToDto(entity.purchase);
		return dto;
	}

	static dtoToEntity(dto: DetailOrderDto): DetailOrderEntity {
		const entity = new DetailOrderEntity();
		entity.id = dto.id;
		entity.amount = dto.amount;
		entity.discount = DiscountMap.dtoToEntity(dto.discount);
		entity.product = ProductMap.dtoToEntity(dto.product);
		entity.purchase = PurchaseMap.dtoToEntity(dto.purchase);
		return entity;
	}

	static createDtoToEntity(dto: CreateDetailOrderDto): DetailOrderEntity {
		const entity = new DetailOrderEntity();
		entity.product = new ProductEntity(dto.productId);
		entity.amount = dto.amount;
		entity.discount = new DiscountEntity(dto.discountId);
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
		entity.amount = domain.amount;
		return entity;
	}

	static toDto(domain: DetailOrderDomain): DetailOrderDto {
		const dto = new DetailOrderDto();
		dto.id = domain.id.toValue();
		dto.product = ProductMap.toDto(domain.product);
		dto.amount = domain.amount;
		dto.discount = DiscountMap.toDto(domain.discount);
		dto.purchase = PurchaseMap.toDto(domain.purchase);
		return dto;
	}

	static toDtos(domains: DetailOrderDomain[]): DetailOrderDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: DetailOrderEntity[]): DetailOrderDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

}
