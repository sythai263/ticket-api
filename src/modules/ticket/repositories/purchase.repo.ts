import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { PurchaseDomain } from '../../../domain';
import { PurchaseEntity } from '../../../entities';
import { PurchaseMap } from '../mapper';

@Injectable()
export class PurchaseRepository implements IRepo<PurchaseEntity, PurchaseDomain> {

	constructor(
		@InjectRepository(PurchaseEntity)
		protected repo: Repository<PurchaseEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<PurchaseEntity>): Promise<PurchaseDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return PurchaseMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<PurchaseEntity> | FindOptionsWhere<PurchaseEntity>[]): Promise<PurchaseDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return PurchaseMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<PurchaseDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return PurchaseMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<PurchaseEntity>): Promise<PurchaseDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return PurchaseMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<PurchaseEntity> | FindOptionsWhere<PurchaseEntity>[]): Promise<PurchaseDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return PurchaseMap.entityToDomain(entity);
		}

		return null;
	}

	async save(t: PurchaseEntity): Promise<PurchaseDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return PurchaseMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(t: PurchaseEntity[]): Promise<PurchaseDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return PurchaseMap.entitiesToDomains(entities);
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
		| FindOptionsWhere<PurchaseEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(PurchaseEntity, criteria);
			await queryRunner.manager.update(PurchaseEntity, criteria, {
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
