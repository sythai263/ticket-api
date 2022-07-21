'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchDiscountDto extends PageOptionsDto{

	@ApiProperty({
		required: false,
		description:'Từ khóa tìm kiếm'
	})
	@IsOptional()
  @IsString()
		keyword?: string;

	@ApiProperty({
		required: false,
		description:'Code giảm giá'
	})
	@IsOptional()
  @IsString()
		code?: string;
}
