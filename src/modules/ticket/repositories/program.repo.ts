import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { ProgramDomain } from '../../../domain';
import { ProgramEntity } from '../../../entities';
import { SearchProgramDto } from '../infrastructures/dtos/program';
import { ProgramMap } from '../mapper';

@Injectable()
export class ProgramRepository implements IRepo<ProgramEntity, ProgramDomain> {

	constructor(
		@InjectRepository(ProgramEntity)
		protected repo: Repository<ProgramEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<ProgramEntity>): Promise<ProgramDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return ProgramMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<ProgramEntity> | FindOptionsWhere<ProgramEntity>[]): Promise<ProgramDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return ProgramMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<ProgramDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return ProgramMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<ProgramEntity>): Promise<ProgramDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return ProgramMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<ProgramEntity> | FindOptionsWhere<ProgramEntity>[]): Promise<ProgramDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return ProgramMap.entityToDomain(entity);
		}

		return null;
	}

	async save(program: ProgramEntity): Promise<ProgramDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(program);
			await queryRunner.commitTransaction();

			return ProgramMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(programs: ProgramEntity[]): Promise<ProgramDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(programs);
			await queryRunner.commitTransaction();

			return ProgramMap.entitiesToDomains(entities);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async delete(criteria: string |
		number |
		Date |
		UniqueEntityID |
		string[] |
		number[] |
		Date[] |
		UniqueEntityID[] |
		FindOptionsWhere<ProgramEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(ProgramEntity, criteria);
			await queryRunner.manager.update(ProgramEntity, criteria, {
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

	async search(search?: SearchProgramDto): Promise<[ProgramDomain[], number]> {

		const queryBuilder = this.repo.createQueryBuilder('program')
			.orderBy('program.id', search.order)
			.skip(search.skip)
			.take(search.take);
		if (search.keyword) {
			queryBuilder.andWhere('program.name like :name', { name: `%${search.keyword}%` })
				.orWhere('program.description like :name');
		}

		if (search.endDate) {
			queryBuilder.andWhere('program.endDate <= :endDate', { endDate: search.endDate });
		}

		if (search.startDate) {
			queryBuilder.andWhere('program.startDate >= :startDate', { startDate: search.startDate });
		}

		if (search.min) {
			queryBuilder.andWhere('program.price >= :min', { min: search.min });
		}

		if (search.max) {
			queryBuilder.andWhere('program.price <= :max', { max: search.max });
		}

		const [entities, count ]= await queryBuilder.getManyAndCount();

		if (entities) {
			return [ProgramMap.entitiesToDomains(entities), count];
		}

		return null;

	}
}
