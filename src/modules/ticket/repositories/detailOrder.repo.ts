import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { DetailOrderDomain } from '../../../domain';
import { DetailOrderEntity } from '../../../entities';
import { DetailOrderMap } from '../mapper';

@Injectable()
export class DetailOrderRepository implements IRepo<DetailOrderEntity, DetailOrderDomain> {

	constructor(
		@InjectRepository(DetailOrderEntity)
		protected repo: Repository<DetailOrderEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<DetailOrderEntity>): Promise<DetailOrderDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return DetailOrderMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<DetailOrderEntity> | FindOptionsWhere<DetailOrderEntity>[]): Promise<DetailOrderDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return DetailOrderMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<DetailOrderDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return DetailOrderMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<DetailOrderEntity>): Promise<DetailOrderDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return DetailOrderMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<DetailOrderEntity> | FindOptionsWhere<DetailOrderEntity>[]): Promise<DetailOrderDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return DetailOrderMap.entityToDomain(entity);
		}

		return null;
	}

	async save(t: DetailOrderEntity): Promise<DetailOrderDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return DetailOrderMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(t: DetailOrderEntity[]): Promise<DetailOrderDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return DetailOrderMap.entitiesToDomains(entities);
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
		| FindOptionsWhere<DetailOrderEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(DetailOrderEntity, criteria);
			await queryRunner.manager.update(DetailOrderEntity, criteria, {
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
