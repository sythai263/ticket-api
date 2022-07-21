'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchAttendeeDto extends PageOptionsDto{

	@ApiProperty({
		required: false,
		description:'Từ khóa cần tìm trong tên và mô tả sự kiện'
	})
	@IsOptional()
  @IsString()
		nameProgram?: string;

	@ApiProperty({
		required: false,
		description:'Tìm theo username'
	})
	@IsOptional()
  @IsString()
		username?: string;

	@ApiProperty({
		required: false,
		description:'Tìm theo tên chương trình'
	})
	@IsOptional()
  @IsString()
		name?: string;
}
