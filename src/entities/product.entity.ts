import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { DetailOrderEntity } from './detailOrder.entity';
import { ImageEntity } from './images.entity';
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
  	name: 'total',
  })
  	total: number;

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

  @OneToMany(() => DetailOrderEntity, (detail) => detail.product)
  	detail: DetailOrderEntity[];

  @OneToMany(() => ProgramItemEntity, (item) => item.product)
  	items: ProgramItemEntity[];

	@OneToMany(() => ImageEntity, (image) => image.product)
  	images: ImageEntity[];

  @OneToMany(() => ReviewProductEntity, (reviewProduct) => reviewProduct.product)
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
  	this.total = remain;
  	this.avatar = avatar;
  	this.description = description;
  }
}
