import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'review_product' })
@Unique('UQ_REVIEW_PRODUCT', ['user', 'product'])
export class ReviewProductEntity extends AbstractEntity {
	
	@JoinColumn({
		name: 'user_id'
	})
	@ManyToOne(()=> UserEntity, user => user.reviewedProducts)
	user: UserEntity;

	@JoinColumn({
		name: 'product_id',
	})
	@ManyToOne(()=> ProductEntity, product => product.reviewedProducts)
	product: ProductEntity;

	@Column({
		name: 'star',
	})
	star: number;

	@JoinColumn({
		name:'comment'
	})
	comment: string;

	constructor(
		id?: number,
		userId?: number,
		productId?: number,
		star?: number,
		comment?: string,

	) {
		super(id);
		this.user = new UserEntity(userId);
		this.product = new ProductEntity(productId);
		this.comment = comment;
		this.star = star;
	}

}
