import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { CreateDetailOrderDto } from '../detailOrder';

export class CreatePurchaseDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		userId: number;

	@ApiProperty({
		isArray: true
	})
		details: CreateDetailOrderDto[];

}
