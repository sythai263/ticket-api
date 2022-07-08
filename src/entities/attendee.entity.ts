import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Unique } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { InvoiceEntity } from '.';
import { ProgramEntity } from './program.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'attendee' })
@Unique('UQ_ATTENDEE', ['user', 'program'])
export class AttendeeEntity extends AbstractEntity {
  @JoinColumn({
  	name: 'user_id',
  })
  @ManyToOne(() => UserEntity, (user) => user.attendees)
  	user: UserEntity;

  @JoinColumn({
  	name: 'program_id',
  })
  @ManyToOne(() => ProgramEntity)
  	program: ProgramEntity;

	@OneToOne(() => InvoiceEntity)
	@JoinColumn({
		name: 'invoice_id'
	})
		invoice: InvoiceEntity;

	@Column({
		name: 'image_qr',
		length: 255,
		nullable: true
	})
		imageQR: string;

	constructor(id?: number, userId?: number, programId?: number, invoiceId?: number, imageQR?: string) {
		super(id);
		this.user = new UserEntity(userId);
		this.program = new ProgramEntity(programId);
		this.invoice = new InvoiceEntity(invoiceId);
		this.imageQR = imageQR;
	}
}
