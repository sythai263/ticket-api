'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { StatusInvoice } from '../../../../../common/constants/statusReceipt';
import { PageOptionsDto } from '../../../../../common/dto/PageOptionsDto';

export class SearchAttendeeDto extends PageOptionsDto {
	@ApiProperty({
		required: false,
		description: 'Tìm theo username',
	})
	@IsOptional()
	@IsString()
	username?: string;

	@ApiProperty({
		required: false,
		description: 'Tìm theo tên chương trình',
	})
	@IsOptional()
	@IsString()
	keyword?: string;

	@ApiProperty({
		required: false,
		description: 'Trạng thái thanh toán',
		enum: StatusInvoice,
	})
	@IsOptional()
	@IsString()
	paid?: StatusInvoice;

	idProgram?: number;
}
