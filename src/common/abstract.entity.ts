import { IsInt } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  	id: number;

  @CreateDateColumn({
  	type: 'timestamp',
  	name: 'created_at',
  })
  	createdAt: Date;

  @UpdateDateColumn({
  	type: 'timestamp',
  	name: 'updated_at',
  })
  	updatedAt: Date;

  @DeleteDateColumn({
  	type: 'timestamp',
  	name: 'deleted_at',
  	nullable: true,
  })
  	deletedAt?: Date;

  @IsInt()
  @Column({
  	name: 'created_by',
  })
  	createdBy: number;

  @IsInt()
  @Column({
  	name: 'updated_by',
  })
  	updatedBy: number;

  @IsInt()
  @Column({
  	name: 'deleted_by',
  	nullable: true,
  })
  	deletedBy?: number;

  constructor(id?: number) {
  	this.id = id;
  }
}
