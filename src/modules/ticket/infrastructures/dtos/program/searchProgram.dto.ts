'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchProgramDto extends PageOptionsDto {
	@ApiProperty({
		required: false,
		description: 'Từ khóa tìm kiếm',
	})
	@IsOptional()
	@IsString()
	keyword?: string;

	@ApiProperty({
		required: false,
		description: 'Ngày tối thiểu',
	})
	@IsOptional()
	@IsDateString()
	startDate?: Date;

	@ApiProperty({
		required: false,
		description: 'Ngày tối đa',
	})
	@IsOptional()
	@IsDateString()
	endDate?: Date;

	@ApiProperty({
		required: false,
		description: 'Phí nhỏ nhất của sự kiện',
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'min Phải là số dương ',
	})
	min?: number;

	@ApiProperty({
		required: false,
		description: 'Phí tối đa của sự kiện',
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Max phải là số dương',
	})
	max?: number;
}
