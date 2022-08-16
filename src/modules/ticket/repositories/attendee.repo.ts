import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { AttendeeDomain } from '../../../domain';
import { AttendeeEntity } from '../../../entities';
import { SearchAttendeeDto } from '../infrastructures/dtos/attendee';
import { AttendeeMap } from '../mapper';

@Injectable()
export class AttendeeRepository implements IRepo<AttendeeEntity, AttendeeDomain> {
	constructor(
		@InjectRepository(AttendeeEntity)
		protected repo: Repository<AttendeeEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<AttendeeEntity>): Promise<AttendeeDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return AttendeeMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(
		where: FindOptionsWhere<AttendeeEntity> | FindOptionsWhere<AttendeeEntity>[],
	): Promise<AttendeeDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return AttendeeMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<AttendeeDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return AttendeeMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<AttendeeEntity>): Promise<AttendeeDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return AttendeeMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(
		where: FindOptionsWhere<AttendeeEntity> | FindOptionsWhere<AttendeeEntity>[],
	): Promise<AttendeeDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return AttendeeMap.entityToDomain(entity);
		}

		return null;
	}

	async save(t: AttendeeEntity): Promise<AttendeeDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return AttendeeMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(t: AttendeeEntity[]): Promise<AttendeeDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return AttendeeMap.entitiesToDomains(entities);
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
			| FindOptionsWhere<AttendeeEntity>,
		userId?: number,
	): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(AttendeeEntity, criteria);
			await queryRunner.manager.update(AttendeeEntity, criteria, {
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

	async delete(
		criteria:
			| string
			| number
			| Date
			| UniqueEntityID
			| string[]
			| number[]
			| Date[]
			| UniqueEntityID[]
			| FindOptionsWhere<AttendeeEntity>,
		userId?: number,
	): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.delete(AttendeeEntity, criteria);
			await queryRunner.manager.update(AttendeeEntity, criteria, {
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

	async search(search?: SearchAttendeeDto): Promise<[AttendeeDomain[], number]> {
		const queryBuilder = this.repo
			.createQueryBuilder('attendee')
			.leftJoinAndSelect('attendee.user', 'user')
			.leftJoinAndSelect('attendee.program', 'program')
			.leftJoinAndSelect('attendee.invoice', 'invoice')
			.where('program.id = :programId', { programId: search.idProgram })
			.orderBy('attendee.id', search.order)
			.skip(search.skip)
			.take(search.take);
		if (search.keyword) {
			queryBuilder
				.andWhere('program.name like :name', { name: `%${search.keyword}%` })
				.orWhere('program.description like :name');
		}

		if (search.username) {
			queryBuilder.andWhere('user.username= :username', { username: search.username });
		}

		if (search.paid) {
			queryBuilder.andWhere('invoice.status = :paid', { paid: search.paid });
		}

		const [entities, count] = await queryBuilder.getManyAndCount();

		if (entities) {
			return [AttendeeMap.entitiesToDomains(entities), count];
		}

		return null;
	}
}
