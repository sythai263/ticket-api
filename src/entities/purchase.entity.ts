import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { DetailOderEntity } from './detailOrder.entity';
import { ReceiptEntity } from './receipt.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'purchase' })
export class PurchaseEntity extends AbstractEntity {
	
	@JoinColumn({
		name: 'user_id'
	})
	@ManyToOne(()=> UserEntity, user => user.orders)
	user: UserEntity;

	@OneToOne(() => ReceiptEntity)
	@JoinColumn({
		name: 'receipt_id',
	})
	receipt: ReceiptEntity;

	@Column({
		name: 'order_date',
	})
	orderDate: Date;

	@OneToMany(() => DetailOderEntity, detail => detail.id)
	detail: DetailOderEntity[];

	constructor(
		id?: number,
		userId?: number,
		receiptId?: number,
		orderDate?: Date,
	) {
		super(id);
		this.receipt = new ReceiptEntity(receiptId);
		this.user = new UserEntity(userId);
		this.orderDate = orderDate;
	}

}
