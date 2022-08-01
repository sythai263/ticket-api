import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { ImageDomain } from '../../../domain';
import { ImageEntity } from '../../../entities';
import { ImageMap } from '../mapper';

@Injectable()
export class ImageRepository implements IRepo<ImageEntity, ImageDomain> {

	constructor(
		@InjectRepository(ImageEntity)
		protected repo: Repository<ImageEntity>,
		private dataSource: DataSource,
	) {}

	async find(options?: FindManyOptions<ImageEntity>): Promise<ImageDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return ImageMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<ImageEntity> | FindOptionsWhere<ImageEntity>[]): Promise<ImageDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return ImageMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<ImageDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return ImageMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<ImageEntity>): Promise<ImageDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return ImageMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<ImageEntity> | FindOptionsWhere<ImageEntity>[]): Promise<ImageDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return ImageMap.entityToDomain(entity);
		}

		return null;
	}

	async save(t: ImageEntity): Promise<ImageDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return ImageMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(t: ImageEntity[]): Promise<ImageDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return ImageMap.entitiesToDomains(entities);
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
		| FindOptionsWhere<ImageEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(ImageEntity, criteria);
			await queryRunner.manager.update(ImageEntity, criteria, {
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
