import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { ProductEntity } from '.';

@Entity({ name: 'image' })
export class ImageEntity extends AbstractEntity {
  @JoinColumn({
  	name: 'product_id',
  })
  @ManyToOne(() => ProductEntity, (product) => product.images)
  	product: ProductEntity;

	@Column({
		name:'alt'
	})
		alt: string;

	@Column({
		name:'url'
	})
		url: string;

	constructor(url?: string, alt?: string, id?: number) {
		super(id);
		this.alt = alt;
		this.url = url;
	}
}
