import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { ProductDomain } from '../../../domain';
import { ProductEntity } from '../../../entities';
import { SearchProductDto } from '../infrastructures/dtos/product';
import { ProductMap } from '../mapper';

@Injectable()
export class ProductRepository implements IRepo<ProductEntity, ProductDomain> {
	constructor(
		@InjectRepository(ProductEntity)
		protected repo: Repository<ProductEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<ProductEntity>): Promise<ProductDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return ProductMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<ProductEntity> | FindOptionsWhere<ProductEntity>[]): Promise<ProductDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return ProductMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<ProductDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return ProductMap.entityToDomain(entity);
		}

		return null;
	}

	async findByIds(ids: number[]): Promise<ProductDomain[]> {
		const queryBuilder = this.repo.createQueryBuilder('product').whereInIds(ids);
		const entities = await queryBuilder.getMany();
		if (entities.length !== 0) {
			return ProductMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findOne(options: FindOneOptions<ProductEntity>): Promise<ProductDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return ProductMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<ProductEntity> | FindOptionsWhere<ProductEntity>[]): Promise<ProductDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return ProductMap.entityToDomain(entity);
		}

		return null;
	}

	async save(product: ProductEntity): Promise<ProductDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(product);
			await queryRunner.commitTransaction();

			return ProductMap.createEntityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(products: ProductEntity[]): Promise<ProductDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(products);
			await queryRunner.commitTransaction();

			return ProductMap.entitiesToDomains(entities);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async softDelete(
		criteria:
			| string
			| number
			| Date
			| UniqueEntityID
			| string[]
			| number[]
			| Date[]
			| UniqueEntityID[]
			| FindOptionsWhere<ProductEntity>,
		userId?: number,
	): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(ProductEntity, criteria);
			await queryRunner.manager.update(ProductEntity, criteria, {
				deletedBy: userId,
				updatedBy: userId,
			});
			await queryRunner.commitTransaction();
			return true;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			return false;
		}
	}

	async search(search?: SearchProductDto): Promise<[ProductDomain[], number]> {
		const queryBuilder = this.repo
			.createQueryBuilder('product')
			.leftJoinAndSelect('product.reviewedProducts', 'reviews')
			.leftJoinAndSelect('reviews.user', 'user')
			.leftJoinAndSelect('product.detail', 'detail')
			.where('product.deleted_at IS NULL')
			.orderBy('product.id', search.order)
			.skip(search.skip)
			.take(search.take);
		if (search.keyword) {
			queryBuilder
				.andWhere('product.name like :name', { name: `%${search.keyword}%` })
				.orWhere('product.description like :name');
		}

		if (search.min) {
			queryBuilder.andWhere('product.price >= :min', { min: search.min });
		}

		if (search.max) {
			queryBuilder.andWhere('product.price <= :max', { max: search.max });
		}

		queryBuilder.relation('product.reviewedProducts');
		queryBuilder.relation('product.detail');
		const [entities, count] = await queryBuilder.getManyAndCount();

		if (entities) {
			return [ProductMap.entitiesToDomains(entities), count];
		}

		return null;
	}
}
