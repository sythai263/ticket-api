'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchProductDto extends PageOptionsDto {
	@ApiProperty({
		required: false,
		description: 'Từ khóa tìm kiếm',
	})
	@IsOptional()
	@IsString()
	keyword?: string;

	@ApiProperty({
		required: false,
		description: 'Giá tối thiểu của sản phẩm ',
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Min phải là số dương',
	})
	min?: number;

	@ApiProperty({
		required: false,
		description: 'Giá tối đa của sản phẩm',
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Max phải là số dương',
	})
	max?: number;
}
