import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { InvoiceDomain } from '../../../domain';
import { InvoiceEntity } from '../../../entities';
import { InvoiceMap } from '../mapper';

@Injectable()
export class InvoiceRepository implements IRepo<InvoiceEntity, InvoiceDomain> {

	constructor(
		@InjectRepository(InvoiceEntity)
		protected repo: Repository<InvoiceEntity>,
		private dataSource: DataSource,
	) { }

	async find(options?: FindManyOptions<InvoiceEntity>): Promise<InvoiceDomain[]> {
		const entities = await this.repo.find(options);
		if (entities) {
			return InvoiceMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findBy(where: FindOptionsWhere<InvoiceEntity> | FindOptionsWhere<InvoiceEntity>[]): Promise<InvoiceDomain[]> {
		const entities = await this.repo.findBy(where);
		if (entities) {
			return InvoiceMap.entitiesToDomains(entities);
		}

		return null;
	}

	async findById(id: number): Promise<InvoiceDomain> {
		const entity = await this.repo.findOneBy({ id });
		if (entity) {
			return InvoiceMap.entityToDomain(entity);
		}

		return null;
	}

	async findOne(options: FindOneOptions<InvoiceEntity>): Promise<InvoiceDomain> {
		const entity = await this.repo.findOne(options);
		if (entity) {
			return InvoiceMap.entityToDomain(entity);
		}

		return null;
	}

	async findOneBy(where: FindOptionsWhere<InvoiceEntity> | FindOptionsWhere<InvoiceEntity>[]): Promise<InvoiceDomain> {
		const entity = await this.repo.findOneBy(where);
		if (entity) {
			return InvoiceMap.entityToDomain(entity);
		}

		return null;
	}

	async save(t: InvoiceEntity): Promise<InvoiceDomain> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entity = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return InvoiceMap.entityToDomain(entity);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			return null;
		}
	}

	async saveMany(t: InvoiceEntity[]): Promise<InvoiceDomain[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const entities = await queryRunner.manager.save(t);
			await queryRunner.commitTransaction();

			return InvoiceMap.entitiesToDomains(entities);
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
		| FindOptionsWhere<InvoiceEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.softDelete(InvoiceEntity, criteria);
			await queryRunner.manager.update(InvoiceEntity, criteria, {
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

	async delete(criteria: string
		| number
		| Date
		| UniqueEntityID
		| string[]
		| number[]
		| Date[]
		| UniqueEntityID[]
		| FindOptionsWhere<InvoiceEntity>, userId?: number): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await queryRunner.manager.delete(InvoiceEntity, criteria);
			await queryRunner.manager.update(InvoiceEntity, criteria, {
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
