import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateDetailOrderDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		discountId: number;

	@ApiProperty()
	@IsNumber()
		productId: number;

	@ApiProperty()
	@IsNumber()
		amount: number;

}
