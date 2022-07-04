'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchInvoiceDto extends PageOptionsDto{

	@ApiProperty({
		required: false,
		description:'Keyword search'
	})
	@IsOptional()
  @IsString()
		keyword?: string;

	@ApiProperty({
		required: false,
		description: 'Min invoice amount'
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message:'Min value more than 0'
	})
		min?: number;

	@ApiProperty({
		required: false,
		description: 'Max invoice amount'
	})
	@IsOptional()
	@IsNumber()
	@Min(0, {
		message:'Max value more than 0'
	})
		max?: number;

	@ApiProperty({
		required: false,
		description: 'Min date payment',
	})
	@IsOptional()
	@IsDateString()
		minDate?: Date;

	@ApiProperty({
		required: false,
		description: 'Min date payment',
	})
	@IsOptional()
	@IsDateString()
		maxDate?: Date;

}
