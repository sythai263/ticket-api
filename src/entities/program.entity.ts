import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { AttendeeEntity } from './attendee.entity';
import { DiscountEntity } from './discount.entity';
import { ProgramItemEntity } from './programItem.entity';
import { ReviewProgramEntity } from './reviewProgram.entity';

@Entity({ name: 'program' })
export class ProgramEntity extends AbstractEntity {
  @Column({
  	nullable: false,
  	name: 'name',
  	length: 255,
  })
  	name: string;

  @Column({
  	nullable: true,
  	name: 'start_date',
  	type: 'timestamp',
  })
  	startDate: Date;

  @Column({
  	nullable: true,
  	name: 'end_date',
  	type: 'timestamp',
  })
  	endDate: Date;

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
  	name: 'place',
  	length: 500,
	})
  	place: string;

  @Column({
  	nullable: true,
  	name: 'avatar',
  	length: 255,
  })
  	avatar: string;

	@Column({
		name: 'image_qr',
		length: 255,
		nullable: true
	})
		imageQR: string;

	@Column({
  	nullable: false,
		name: 'allow_check_in',
		default: false
	})
  	allowCheckIn: boolean;

  @OneToMany(() => AttendeeEntity, (attendee) => attendee.program)
  	attendees: AttendeeEntity[];

  @OneToMany(() => DiscountEntity, (discount) => discount.program)
  	discounts: DiscountEntity[];

  @OneToMany(() => ProgramItemEntity, (item) => item.program)
  	items: ProgramItemEntity[];

  @OneToMany(() => ReviewProgramEntity, (reviewProgram) => reviewProgram.program)
  	reviewedPrograms: ReviewProgramEntity[];

  constructor(
  	id?: number,
  	name?: string,
  	startDate?: Date,
  	endDate?: Date,
  	amount?: number,
  	description?: string,
  ) {
  	super(id);

  	this.name = name;
  	this.startDate = startDate;
  	this.endDate = endDate;
  	this.total = amount;
  	this.description = description;
  }
}
