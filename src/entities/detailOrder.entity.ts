import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { DiscountEntity } from './discount.entity';
import { ProductEntity } from './product.entity';
import { PurchaseEntity } from './purchase.entity';

@Entity({ name: 'detail_order' })
export class DetailOrderEntity extends AbstractEntity {
  @JoinColumn({
  	name: 'purchase_id',
  })
  @ManyToOne(() => PurchaseEntity, (order) => order.details)
  	purchase: PurchaseEntity;

  @JoinColumn({
  	name: 'product_id',
  })
  @ManyToOne(() => ProductEntity, (product) => product.detail)
  	product: ProductEntity;

  @Column({
  	name: 'amount',
  })
  	amount: number;

  @JoinColumn({
  	name: 'discount_id',
  })
  @ManyToOne(() => DiscountEntity, (discount) => discount.detail)
  	discount?: DiscountEntity;

  constructor(
  	id?: number,
  	orderId?: number,
  	productId?: number,
  	amount?: number,
  	discountId?: number,
  ) {
  	super(id);
  	this.amount = amount;
  	this.purchase = new PurchaseEntity(orderId);
  	this.product = new ProductEntity(productId);
  	this.discount = new DiscountEntity(discountId);
  }
}
