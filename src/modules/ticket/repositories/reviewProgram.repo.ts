import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { ReviewProgramDomain } from '../../../domain';
import { ReviewProgramEntity } from '../../../entities';
import { ReviewProgramMap } from '../mapper';

@Injectable()
export class ReviewProgramRepository implements IRepo<ReviewProgramEntity, ReviewProgramDomain> {

	constructor(
		@InjectRepository(ReviewProgramEntity)
		protected repo: Repository<ReviewProgramEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<ReviewProgramEntity>): Promise<ReviewProgramDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return ReviewProgramMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<ReviewProgramEntity> | FindOptionsWhere<ReviewProgramEntity>[]): Promise<ReviewProgramDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return ReviewProgramMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<ReviewProgramDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return ReviewProgramMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<ReviewProgramEntity>): Promise<ReviewProgramDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return ReviewProgramMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<ReviewProgramEntity> | FindOptionsWhere<ReviewProgramEntity>[]): Promise<ReviewProgramDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return ReviewProgramMap.entityToDomain(entity);
		}

		return null;
	}

	async save(t: ReviewProgramEntity): Promise<ReviewProgramDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return ReviewProgramMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(t: ReviewProgramEntity[]): Promise<ReviewProgramDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return ReviewProgramMap.entitiesToDomains(entities);
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
		| FindOptionsWhere<ReviewProgramEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(ReviewProgramEntity, criteria);
			await queryRunner.manager.update(ReviewProgramEntity, criteria, {
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
