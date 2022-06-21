import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { ProgramEntity } from './program.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'review_program' })
@Unique('UQ_REVIEW_PROGRAM', ['user', 'program'])
export class ReviewProgramEntity extends AbstractEntity {
	
	@JoinColumn({
		name: 'user_id'
	})
	@ManyToOne(()=> UserEntity, user => user.reviewedPrograms)
	user: UserEntity;

	@JoinColumn({
		name: 'program_id',
	})
	@ManyToOne(()=> ProgramEntity, program => program.reviewedPrograms)
	program: ProgramEntity;

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
		programId?: number,
		star?: number,
		comment?: string,

	) {
		super(id);
		this.user = new UserEntity(userId);
		this.program = new ProgramEntity(programId);
		this.comment = comment;
		this.star = star;
	}

}
