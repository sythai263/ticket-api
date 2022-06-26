import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { DetailOderEntity } from './detailOrder.entity';
import { ProgramItemEntity } from './programItem.entity';
import { ReviewProductEntity } from './reviewProduct.entity';

@Entity({ name: 'product' })
export class ProductEntity extends AbstractEntity {
  @Column({
  	nullable: false,
  	name: 'name',
  	length: 255,
  })
  	name: string;

  @Column({
  	nullable: false,
  	name: 'remain',
  })
  	remain: number;

  @Column({
  	nullable: false,
  	name: 'price',
  })
  	price: number;

  @Column({
  	name: 'description',
  	type: 'text',
  })
  	description: string;

  @Column({
  	nullable: true,
  	name: 'avatar',
  	length: 255,
  })
  	avatar: string;

  @OneToMany(() => DetailOderEntity, (detail) => detail.id)
  	detail: DetailOderEntity[];

  @OneToMany(() => ProgramItemEntity, (item) => item.id)
  	items: ProgramItemEntity[];

  @OneToMany(() => ReviewProductEntity, (reviewProduct) => reviewProduct.id)
  	reviewedProducts: ReviewProductEntity[];

  constructor(
  	id?: number,
  	name?: string,
  	remain?: number,
  	price?: number,
  	avatar?: string,
  	description?: string,
  ) {
  	super(id);

  	this.name = name;
  	this.price = price;
  	this.remain = remain;
  	this.avatar = avatar;
  	this.description = description;
  }
}
