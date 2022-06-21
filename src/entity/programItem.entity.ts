import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { ProductEntity } from './product.entity';
import { ProgramEntity } from './program.entity';

@Entity({ name: 'program_item' })
@Unique('UQ_PROGRAM_ITEM', ['program', 'product'])
export class ProgramItemEntity extends AbstractEntity {
	@JoinColumn({
		name: 'product_id'
	})
	@ManyToOne(()=> ProductEntity, product => product.items)
	product: ProductEntity;

	@JoinColumn({
		name: 'user_id'
	})
	@ManyToOne(()=> ProgramEntity, program => program.items)
	program: ProgramEntity;
	
	constructor(
		id?: number,
		programId?: number,
		productId?: number,
	) {
		super(id);
		this.program = new ProgramEntity(programId);
		this.product = new ProductEntity(productId);

	}
}
