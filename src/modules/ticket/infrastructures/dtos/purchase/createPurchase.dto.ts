import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, MaxLength } from 'class-validator';

import { CreateDetailOrderDto } from '../detailOrder';

export class CreatePurchaseDto{

	@ApiProperty({
		isArray: true,
		type: CreateDetailOrderDto,
	})
	@IsArray()
		details: CreateDetailOrderDto[];

	@ApiPropertyOptional({
		example: 10
	})
	@IsString({
		message: 'Mã giảm giá không hợp lệ'
	})
	@MaxLength(15, {
		message:'Mã giảm giá không hợp lệ'
	})

		discountCode?: string;

}
