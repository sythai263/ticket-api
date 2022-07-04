import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { IRepo } from '../../../core/infra/Repo';
import { InvoiceDomain } from '../../../domain';
import { InvoiceEntity } from '../../../entities';

@Injectable()
export class InvoiceRepository implements IRepo<InvoiceEntity, InvoiceDomain> {

	constructor(
		@InjectRepository(InvoiceEntity)
		protected repo: Repository<InvoiceEntity>,
		private dataSource: DataSource,
	) { }

	find(options?: FindManyOptions<InvoiceEntity>): Promise<InvoiceDomain[]> {
		throw new Error('Method not implemented.');
	}

	findBy(where: FindOptionsWhere<InvoiceEntity> | FindOptionsWhere<InvoiceEntity>[]): Promise<InvoiceDomain[]> {
		throw new Error('Method not implemented.');
	}

	findById(id: number): Promise<InvoiceDomain> {
		throw new Error('Method not implemented.');
	}

	findOne(options: FindOneOptions<InvoiceEntity>): Promise<InvoiceDomain> {
		throw new Error('Method not implemented.');
	}

	findOneBy(where: FindOptionsWhere<InvoiceEntity> | FindOptionsWhere<InvoiceEntity>[]): Promise<InvoiceDomain> {
		throw new Error('Method not implemented.');
	}

	save(t: InvoiceEntity): Promise<InvoiceDomain> {
		throw new Error('Method not implemented.');
	}

	saveMany(t: InvoiceEntity[]): Promise<InvoiceDomain[]> {
		throw new Error('Method not implemented.');
	}

	delete(criteria: string | number | Date | UniqueEntityID | string[] | number[] | Date[] | UniqueEntityID[] | FindOptionsWhere<InvoiceEntity>): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

}
