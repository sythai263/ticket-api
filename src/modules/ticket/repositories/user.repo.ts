import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	DataSource,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere, Repository
} from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { UserDomain } from '../../../domain/user.domain';
import { UserEntity } from '../../../entities/user.entity';
import { UserMap } from '../mapper/user.mapper';

@Injectable()
export class UserRepository implements IRepo<UserEntity, UserDomain> {
	constructor(
		@InjectRepository(UserEntity)
		protected repo: Repository<UserEntity>,
		private dataSource: DataSource,
	) {}

	async findBy(
		where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
	): Promise<UserDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return UserMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findOneBy(
		where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
	): Promise<UserDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return UserMap.entityToDomain(entity);
		}

		return null;
	}

	async delete(
		criteria:
      | string
      | number
      | FindOptionsWhere<UserEntity>
      | UniqueEntityID
      | string[]
      | number[]
      | Date[]
			| UniqueEntityID[],
		userId?: number
	): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(UserEntity, criteria);
			await queryRunner.manager.update(UserEntity, criteria, {
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

	async findOne(options: FindOneOptions<UserEntity>): Promise<UserDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return UserMap.entityToDomain(entity);
		}

		return null;
	}

	async findByUsername(username: string): Promise<UserDomain> {
		const entity = await this.repo.findOneBy({ username });
		if (entity) {
			return UserMap.entityToDomain(entity);
		}

		return null;
	}

	async findByEmail(email: string): Promise<UserDomain> {
		const entity = await this.repo.findOneBy({ email });
		if (entity) {
			return UserMap.entityToDomain(entity);
		}

		return null;
	}

	async findByPhone(phone: string): Promise<UserDomain> {
		const entity = await this.repo.findOneBy({ phone });
		if (entity) {
			return UserMap.entityToDomain(entity);
		}

		return null;
	}

	async save(user: UserEntity): Promise<UserDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(user);
			await queryRunner.commitTransaction();

			return UserMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();

			return null;
		}
	}

	async saveMany(users: UserEntity[]): Promise<UserDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(users);
			await queryRunner.commitTransaction();

			return UserMap.entitiesToDomains(entities);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async find(options?: FindManyOptions<UserEntity>): Promise<UserDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return UserMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<UserDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return UserMap.entityToDomain(entity);
		}

		return null;
	}
}
