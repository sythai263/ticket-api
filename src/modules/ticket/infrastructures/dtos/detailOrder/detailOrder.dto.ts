import { ApiProperty } from '@nestjs/swagger';

import { DiscountDto } from '../discount';
import { ProductDto } from '../product';

export class DetailOrderDto{

	@ApiProperty({
		example: 123
	})
		id: number;

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

	@ApiProperty({
		description: 'Tổng tiền'
	})
		summary: number;

	@ApiProperty({
		description: 'Số tiền được giảm'
	})
		discountAmount: number;

	@ApiProperty({
		description: 'Thành tiền'
	})
		total: number;

}
