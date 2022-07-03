'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchItemDto extends PageOptionsDto{

	@ApiProperty({
		required: false,
		description:'Keyword search by program'
	})
	@IsOptional()
  @IsString()
		nameProgram?: string;

	@ApiProperty({
		required: false,
		description:'find by product name'
	})
	@IsOptional()
  @IsString()
		productName?: string;
}
