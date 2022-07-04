import { ApiProperty } from '@nestjs/swagger';

import { DiscountDto } from '../discount';
import { ProductDto } from '../product';
import { PurchaseDto } from '../purchase';

export class DetailOrderDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		type: PurchaseDto
	})
		purchase: PurchaseDto;

	@ApiProperty({
		type: ProductDto
	})
		product: ProductDto;

	@ApiProperty({
		type: DiscountDto
	})
		discount: DiscountDto;

	@ApiProperty()
		amount: number;

}
