import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { CurrencyCode } from '../common/constants/currencyCode';

@Entity({ name: 'invoice' })
export class InvoiceEntity extends AbstractEntity {
  @Column({
  	name: 'amount',
  	nullable: false,
  })
  	amount: number;

  @Column({
  	name: 'currency_code',
  	type: 'enum',
  	enum: CurrencyCode,
  	default: CurrencyCode.VND,
  })
  	currencyCode: CurrencyCode;

  @Column({
  	name: 'bank_code',
  	length: 50,
  	nullable: true
  })
  	bankCode?: string;

  @Column({
  	name: 'bank_trans_no',
  	length: 50,
  	unique: true,
  	nullable: true

  })
  	bankTransNo: string;

  @Column({
  	name: 'card_type',
  	length: 50,
  	nullable: true

  })
  	cardType: string;

  @Column({
  	name: 'pay_date',
  	default: new Date(),
  })
  	payDate: Date;

  @Column({
  	name: 'info',
  })
  	info: string;

	@Column({
		name: 'status',
	})
  	status: string;

	constructor(
  	id?: number,
  	amount?: number,
  	bankCode?: string,
  	bankTransNo?: string,
  	payDate?: Date,
		info?: string,
		status?: string,
	) {
  	super(id);
  	this.amount = amount;
  	this.bankCode = bankCode;
  	this.bankTransNo = bankTransNo;
  	this.payDate = payDate;
		this.info = info;
		this.status = status;
	}
}
