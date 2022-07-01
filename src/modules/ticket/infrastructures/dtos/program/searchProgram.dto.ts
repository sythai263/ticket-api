'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchProgramDto extends PageOptionsDto{

	@ApiProperty({
		required: false,
		description:'Keyword search'
	})
	@IsOptional()
  @IsString()
		keyword?: string;

	@ApiProperty({
		required: false,
		description: 'Start date program'
	})
	@IsOptional()
	@IsDateString()
		startDate?: Date;

	@ApiProperty({
		required: false,
		description: 'End date program'
	})
	@IsOptional()
	@IsDateString()
		endDate?: Date;

	@ApiProperty({
		required: false,
		description: 'Min price program'
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message:'Min value more than 0'
	})
		min?: number;

	@ApiProperty({
		required: false,
		description: 'Max price program'
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message:'Max value more than 0'
	})
		max?: number;

}
