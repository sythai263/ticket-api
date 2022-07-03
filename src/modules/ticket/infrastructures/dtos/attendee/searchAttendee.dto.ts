'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchAttendeeDto extends PageOptionsDto{

	@ApiProperty({
		required: false,
		description:'Keyword search by program'
	})
	@IsOptional()
  @IsString()
		nameProgram?: string;

	@ApiProperty({
		required: false,
		description:'find by username'
	})
	@IsOptional()
  @IsString()
		username?: string;

	@ApiProperty({
		required: false,
		description:'find by name'
	})
	@IsOptional()
  @IsString()
		name?: string;
}
