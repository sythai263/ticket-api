'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchProductDto extends PageOptionsDto{

	@ApiProperty({
		required: false,
		description:'Keyword search'
	})
	@IsOptional()
  @IsString()
		keyword?: string;

	@ApiProperty({
		required: false,
		description: 'Min price product'
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message:'Min value more than 0'
	})
		min?: number;

	@ApiProperty({
		required: false,
		description: 'Max price product'
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message:'Max value more than 0'
	})
		max?: number;
}
