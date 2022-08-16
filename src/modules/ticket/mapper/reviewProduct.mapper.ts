import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { ReviewProductDomain } from '../../../domain';
import { ProductEntity, ReviewProductEntity, UserEntity } from '../../../entities';
import { CreateReviewProductDto, ReviewProductDto } from '../infrastructures/dtos/reviewProduct';
import { ProductMap } from './product.mapper';
import { UserMap } from './user.mapper';

export class ReviewProductMap {
	static entityToDto(entity: ReviewProductEntity): ReviewProductDto {
		const dto = new ReviewProductDto();
		dto.id = entity.id;
		dto.star = entity.star;
		dto.comment = entity.comment;
		dto.user = UserMap.entityToDto(entity.user);
		return dto;
	}

	static dtoToEntity(dto: ReviewProductDto): ReviewProductEntity {
		const entity = new ReviewProductEntity();
		entity.id = dto.id;
		entity.star = dto.star;
		entity.comment = dto.comment;
		return entity;
	}

	static createDtoToEntity(dto: CreateReviewProductDto): ReviewProductEntity {
		const entity = new ReviewProductEntity();
		entity.product = new ProductEntity(dto.productId);
		entity.comment = dto.comment;
		entity.star = dto.star;
		entity.user = new UserEntity(dto.userId);
		return entity;
	}

	static entityToDomain(entity: ReviewProductEntity): ReviewProductDomain {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const discountOrError = ReviewProductDomain.create(
			{
				user: UserMap.entityToDomain(entity.user),
				product: ProductMap.entityToDomain(entity.product),
				comment: entity.comment,
				star: entity.star,
			},
			new UniqueEntityID(id),
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

	static toEntity(domain: ReviewProductDomain): ReviewProductEntity {
		const entity = new ReviewProductEntity();
		entity.id = domain.id.toValue();
		entity.product = ProductMap.toEntity(domain.product);
		entity.comment = domain.comment;
		entity.star = domain.star;
		entity.user = UserMap.toEntity(domain.user);
		return entity;
	}

	static toDto(domain: ReviewProductDomain): ReviewProductDto {
		const dto = new ReviewProductDto();
		dto.id = domain.id.toValue();
		dto.comment = domain.comment;
		dto.star = domain.star;
		dto.user = UserMap.toShortDto(domain.user);
		dto.user.email = undefined;
		return dto;
	}

	static toDtos(domains: ReviewProductDomain[]): ReviewProductDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: ReviewProductEntity[]): ReviewProductDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}
}
