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
		nullable: false,
		name: 'start_date',
		type: 'timestamp',
	})
	startDate: Date;

	@Column({
		nullable: false,
		name: 'end_date',
		type: 'timestamp',
	})
	endDate: Date;

	@Column({
		nullable: false,
		name: 'amount',
	})
	amount: number;

	@Column({
		nullable: false,
		name: 'price',
	})
	price: number;

	@Column({
		name: 'description',
	})
	description: string;

	@Column({
		nullable: true,
		name: 'avatar',
		length: 255,
	})
	avatar: string;

	@OneToMany(() => AttendeeEntity, attendee => attendee.id)
	attendees: AttendeeEntity[];

	@OneToMany(() => DiscountEntity, discount => discount.id)
	discounts: DiscountEntity[];

	@OneToMany(() => ProgramItemEntity, item => item.id)
	items: ProgramItemEntity[];

	@OneToMany(() => ReviewProgramEntity, reviewProgram => reviewProgram.id)
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
		this.amount = amount;
		this.description = description;
	}
}
