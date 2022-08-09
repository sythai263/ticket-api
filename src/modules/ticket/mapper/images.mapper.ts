import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { ImageDomain } from '../../../domain';
import { ImageEntity } from '../../../entities';
import { ConfigService } from '../../../shared/services/config.service';
import { ImageDto } from '../infrastructures/dtos/image';
import { ProductMap } from './product.mapper';

export class ImageMap {
	static entityToDto(entity: ImageEntity): ImageDto {
		const configService = new ConfigService();
		const url = configService.get('DOMAIN');
		const img = new ImageDto();
		img.alt = entity.alt;
		img.url = url + entity.url;
		img.id = entity.id;
		return img;
	}

	static entityToDomain(entity: ImageEntity) {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const userOrError = ImageDomain.create(
			{
				url: entity.url,
				alt: entity.alt,
				product: ProductMap.entityToDomain(entity.product),
			},
			new UniqueEntityID(id),
		);
		return userOrError.isSuccess ? userOrError.getValue() : null;
	}

	static toEntity(domain: ImageDomain): ImageEntity {
		const entity = new ImageEntity();
		entity.id = domain.id.toValue();
		entity.url = domain.url;
		entity.alt = domain.alt;
		entity.product = ProductMap.toEntity(domain.product);
		return entity;
	}

	static toDto(domain: ImageDomain): ImageDto {
		const configService = new ConfigService();
		const url = configService.get('DOMAIN');
		const dto = new ImageDto();
		dto.url = url + domain.url;
		dto.alt = domain.alt;
		dto.id = domain.id.toValue();
		return dto;
	}

	static entitiesToDomains(entities: ImageEntity[]): ImageDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

	static toDtos(domains: ImageDomain[]): ImageDto[] {
		const dtos = domains.map((entity) => this.toDto(entity));
		return dtos;
	}

	static toEntities(domains: ImageDomain[]): ImageEntity[] {
		const entities = domains.map((entity) => this.toEntity(entity));
		return entities;
	}
}
