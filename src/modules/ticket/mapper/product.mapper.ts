import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { ProductDomain } from '../../../domain';
import { ProductEntity } from '../../../entities';
import { CreateProductDto } from '../infrastructures/dtos/product/createProduct.dto';
import { ProductDto } from '../infrastructures/dtos/product/product.dto';
import { CreateProgramDto } from '../infrastructures/dtos/program/createProgram.dto';

export class ProductMap {
	static entityToDto(entity: ProductEntity): ProductDto {

		const dto = new ProductDto();
		dto.id = entity.id;
		dto.total = entity.total;
		dto.avatar = entity.avatar;
		dto.price = entity.price;
		dto.avatar = entity.avatar;
		dto.name = entity.name;
		dto.description = entity.description;
		return dto;
	}

	static dtoToEntity(dto: ProductDto): ProductEntity {
		const entity = new ProductEntity();
		entity.total = dto.total;
		entity.avatar = dto.avatar;
		entity.price = dto.price;
		entity.avatar = dto.avatar;
		entity.name = dto.name;
		entity.description = dto.description;

		return entity;
	}

	static createDtoToEntity(dto: CreateProductDto): ProductEntity {
		const entity = new ProductEntity();
		entity.total = dto.total;
		entity.avatar = dto.avatar;
		entity.price = dto.price;
		entity.avatar = dto.avatar;
		entity.name = dto.name;
		entity.description = dto.description;
		return entity;
	}

	static entityToDomain(entity: ProductEntity): ProductDomain {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const programOrError = ProductDomain.create(
			{
				total: entity.total,
				avatar: entity.avatar,
				description: entity.description,
				name: entity.name,
				price: entity.price
			},
			new UniqueEntityID(id),
		);
		return programOrError.isSuccess ? programOrError.getValue() : null;
	}

	static toEntity(domain: ProductDomain): ProductEntity {
		const entity = new ProductEntity();
		entity.id = domain.id.toValue();
		entity.total = domain.total;
		entity.avatar = domain.avatar;
		entity.price = domain.price;
		entity.avatar = domain.avatar;
		entity.name = domain.name;
		entity.description = domain.description;
		return entity;
	}

	static toDto(domain: ProductDomain): ProductDto {
		const dto = new ProductDto();
		dto.id = domain.id.toValue();
		dto.total = domain.total;
		dto.avatar = domain.avatar;
		dto.price = domain.price;
		dto.avatar = domain.avatar;
		dto.name = domain.name;
		dto.description = domain.description;

		return dto;
	}

	static toDtos(domains: ProductDomain[]): ProductDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: ProductEntity[]): ProductDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

	static dtoToDomain(dto: CreateProgramDto): ProductDomain{
		if (!dto) {
			return null;
		}

		const programOrError = ProductDomain.create(
			{
				total: dto.total,
				avatar: dto.avatar,
				description: dto.description,
				name: dto.name,
				price: dto.price
			}
		);
		return programOrError.isSuccess ? programOrError.getValue() : null;
	}

}
