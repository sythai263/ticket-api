'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchDiscountDto extends PageOptionsDto{

	@ApiProperty({
		required: false,
		description:'Keyword search'
	})
	@IsOptional()
  @IsString()
		keyword?: string;

	@ApiProperty({
		required: false,
		description:'Keyword search by program'
	})
	@IsOptional()
  @IsString()
		nameProgram?: string;
}
