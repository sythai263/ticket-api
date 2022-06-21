import { IsEmail } from 'class-validator';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { Gender } from '../common/constants/gender';
import { RoleType } from '../common/constants/roleType';
import { AttendeeEntity } from './attendee.entity';
import { PurchaseEntity } from './purchase.entity';
import { ReviewProductEntity } from './reviewProduct.entity';
import { ReviewProgramEntity } from './reviewProgram.entity';

@Entity({ name: 'user' })
@Unique('UQ_USER_PHONE', ['phone'])
@Unique('UQ_USER_EMAIL', ['email'])
@Unique('UQ_USERNAME', ['username'])
export class UserEntity extends AbstractEntity {
	@Column({
		nullable: false,
		name: 'username',
		length: 255,
		unique: true,
	})
		username: string;

	@Column({
		nullable: false,
		name: 'password',
		length: 255,
	})
		password: string;

	@Column({
		nullable: false,
		name: 'first_name',
		length: 255,
	})
		firstName: string;

	@Column({
		nullable: false,
		name: 'last_name',
		length: 255,
	})
		lastName: string;

	@Column({
		unique: true,
		nullable: true,
		name: 'phone',
		length: 15,
	})
		phone: string;

	@Column({
		unique: true,
		nullable: false,
		name: 'email',
		length: 255,
	})
	@IsEmail()
		email: string;

	@Column({
		name: 'birthday',
	})
		birthday: Date;

	@Column({
		name: 'gender',
		type: 'enum',
		enum: Gender
	})
		gender?: Gender;

	@Column({
		nullable: true,
		name: 'avatar',
		length: 255,
	})
		avatar: string;

	@Column({
		type: 'enum',
		enum: RoleType,
		nullable: false,
		default: RoleType.USER,
	})
		role: RoleType;

	@OneToMany(() => AttendeeEntity, attendee => attendee.id)
	attendees: AttendeeEntity[];

	@OneToMany(() => PurchaseEntity, order => order.id)
	orders: PurchaseEntity[];

	@OneToMany(() => ReviewProductEntity, reviewProduct => reviewProduct.id)
	reviewedProducts: ReviewProductEntity[];

	@OneToMany(() => ReviewProgramEntity, reviewProgram => reviewProgram.id)
	reviewedPrograms: ReviewProgramEntity[];

	constructor(
		id?: number,
		username?: string,
		password?: string,
		firstName?: string,
		lastName?: string,

	) {
		super(id);
		this.username = username;
		this.password = password;
		this.lastName = lastName;
		this.firstName = firstName;
	}
}
