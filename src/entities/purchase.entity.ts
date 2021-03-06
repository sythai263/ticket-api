import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne
} from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { StatusBuy } from '../common/constants/statusBuy';
import { DetailOrderEntity } from './detailOrder.entity';
import { InvoiceEntity } from './invoice.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'purchase' })
export class PurchaseEntity extends AbstractEntity {
  @JoinColumn({
  	name: 'user_id',
  })
  @ManyToOne(() => UserEntity, (user) => user.orders)
  	user: UserEntity;

  @OneToOne(() => InvoiceEntity)
  @JoinColumn({
  	name: 'invoice_id',
  })
  	invoice: InvoiceEntity;

  @Column({
  	name: 'order_date',
  })
  	orderDate: Date;

	@Column({
		name: 'status',
		enum: StatusBuy
	})
		status: StatusBuy;

  @OneToMany(() => DetailOrderEntity, (detail) => detail.purchase)
  	details: DetailOrderEntity[];

  constructor(
  	id?: number,
  	userId?: number,
  	invoiceId?: number,
  	orderDate?: Date,
  ) {
  	super(id);
  	this.invoice = new InvoiceEntity(invoiceId);
  	this.user = new UserEntity(userId);
  	this.orderDate = orderDate;
  }
}
