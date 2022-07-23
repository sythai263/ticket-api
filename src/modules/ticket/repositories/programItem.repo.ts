import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { ProgramItemDomain } from '../../../domain';
import { ProgramItemEntity } from '../../../entities';
import { ProgramItemMap } from '../mapper';

@Injectable()
export class ProgramItemRepository implements IRepo<ProgramItemEntity, ProgramItemDomain> {

	constructor(
		@InjectRepository(ProgramItemEntity)
		protected repo: Repository<ProgramItemEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<ProgramItemEntity>): Promise<ProgramItemDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return ProgramItemMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<ProgramItemEntity> | FindOptionsWhere<ProgramItemEntity>[]): Promise<ProgramItemDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return ProgramItemMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<ProgramItemDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return ProgramItemMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<ProgramItemEntity>): Promise<ProgramItemDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return ProgramItemMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<ProgramItemEntity> | FindOptionsWhere<ProgramItemEntity>[]): Promise<ProgramItemDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return ProgramItemMap.entityToDomain(entity);
		}

		return null;
	}

	async save(t: ProgramItemEntity): Promise<ProgramItemDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return ProgramItemMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(t: ProgramItemEntity[]): Promise<ProgramItemDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return ProgramItemMap.entitiesToDomains(entities);
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
		| FindOptionsWhere<ProgramItemEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.delete(ProgramItemEntity, criteria);
			await queryRunner.commitTransaction();
			return true;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			return false;
		}
	}

}
