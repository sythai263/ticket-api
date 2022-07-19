import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { DiscountDomain } from '../../../domain';
import { DiscountEntity } from '../../../entities';
import { DiscountMap } from '../mapper/discount.mapper';

@Injectable()
export class DiscountRepository implements IRepo<DiscountEntity, DiscountDomain> {

	constructor(
		@InjectRepository(DiscountEntity)
		protected repo: Repository<DiscountEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<DiscountEntity>): Promise<DiscountDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return DiscountMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<DiscountEntity> | FindOptionsWhere<DiscountEntity>[]): Promise<DiscountDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return DiscountMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<DiscountDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return DiscountMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<DiscountEntity>): Promise<DiscountDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return DiscountMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<DiscountEntity> | FindOptionsWhere<DiscountEntity>[]): Promise<DiscountDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return DiscountMap.entityToDomain(entity);
		}

		return null;
	}

	async save(t: DiscountEntity): Promise<DiscountDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return DiscountMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(t: DiscountEntity[]): Promise<DiscountDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return DiscountMap.entitiesToDomains(entities);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async softDelete(criteria: string
		| number
		| Date
		| UniqueEntityID
		| string[]
		| number[]
		| Date[]
		| UniqueEntityID[]
		| FindOptionsWhere<DiscountEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(DiscountEntity, criteria);
			await queryRunner.manager.update(DiscountEntity, criteria, {
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
