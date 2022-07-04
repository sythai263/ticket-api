import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { DetailOrderEntity } from './detailOrder.entity';
import { ProgramEntity } from './program.entity';

@Entity({ name: 'discount' })
export class DiscountEntity extends AbstractEntity {
  @JoinColumn({
  	name: 'program_id',
  })
  @ManyToOne(() => ProgramEntity, (program) => program.discounts)
  	program: ProgramEntity;

  @Column({
  	name: 'start_date',
  	type: 'datetime',
  })
  	startDate: Date;

  @Column({
  	name: 'expired_date',
  	type: 'datetime',
  })
  	expiredDate: Date;

  @Column({
  	name: 'discount',
  })
  	discount: number;

  @Column({
  	name: 'description',
  	type: 'text',
  })
  	description: string;

  @OneToMany(() => DetailOrderEntity, (detail) => detail.id)
  	detail: DetailOrderEntity[];

  constructor(
  	id?: number,
  	programId?: number,
  	startDate?: Date,
  	expiredDate?: Date,
  	discount?: number,
  	description?: string,
  ) {
  	super(id);
  	this.program = new ProgramEntity(programId);
  	this.startDate = startDate;
  	this.expiredDate = expiredDate;
  	this.discount = discount;
  	this.description = description;
  }
}
