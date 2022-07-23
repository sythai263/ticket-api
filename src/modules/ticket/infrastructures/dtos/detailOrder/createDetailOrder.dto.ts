import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateDetailOrderDto{

	@ApiProperty({
		example: 1,
		description: 'Mã sản phẩm'
	})
	@IsNumber()
		productId: number;

	@ApiProperty({
		example: 10,
		description: 'Số lượng mua sản phẩm'
	})
	@IsNumber()
		amount: number;

}
