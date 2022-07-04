import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { ReviewProductDomain } from '../../../domain';
import { ReviewProductEntity } from '../../../entities';
import { ReviewProductMap } from '../mapper';

@Injectable()
export class ReviewProductRepository implements IRepo<ReviewProductEntity, ReviewProductDomain> {

	constructor(
		@InjectRepository(ReviewProductEntity)
		protected repo: Repository<ReviewProductEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<ReviewProductEntity>): Promise<ReviewProductDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return ReviewProductMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<ReviewProductEntity> | FindOptionsWhere<ReviewProductEntity>[]): Promise<ReviewProductDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return ReviewProductMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<ReviewProductDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return ReviewProductMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<ReviewProductEntity>): Promise<ReviewProductDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return ReviewProductMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<ReviewProductEntity> | FindOptionsWhere<ReviewProductEntity>[]): Promise<ReviewProductDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return ReviewProductMap.entityToDomain(entity);
		}

		return null;
	}

	async save(t: ReviewProductEntity): Promise<ReviewProductDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return ReviewProductMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(t: ReviewProductEntity[]): Promise<ReviewProductDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return ReviewProductMap.entitiesToDomains(entities);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async delete(criteria: string
		| number
		| Date
		| UniqueEntityID
		| string[]
		| number[]
		| Date[]
		| UniqueEntityID[]
		| FindOptionsWhere<ReviewProductEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(ReviewProductEntity, criteria);
			await queryRunner.manager.update(ReviewProductEntity, criteria, {
				deletedBy: userId,
				updatedBy: userId
			});
			await queryRunner.commitTransaction();
			return true;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			return false;
		}
	}

}
