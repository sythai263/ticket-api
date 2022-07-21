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
		type: PurchaseDto,
		description: 'Thông tin đơn hàng'
	})
		purchase: PurchaseDto;

	@ApiProperty({
		type: ProductDto,
		description: 'Thông tin sản phẩm'
	})
		product: ProductDto;

	@ApiProperty({
		type: DiscountDto,
		description: 'Thông tin mã giảm giá'
	})
		discount: DiscountDto;

	@ApiProperty({
		description: 'Số lượng mua'
	})
		amount: number;

}
