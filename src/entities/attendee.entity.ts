import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
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

  constructor(id?: number, userId?: number, programId?: number) {
  	super(id);
  	const user = new UserEntity(userId);
  	const program = new ProgramEntity(programId);
  	this.user = user;
  	this.program = program;
  }
}
