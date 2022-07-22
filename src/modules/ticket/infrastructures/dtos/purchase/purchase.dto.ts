import { ApiProperty } from '@nestjs/swagger';

import { StatusBuy } from '../../../../../common/constants/statusBuy';
import { DetailOrderDto } from '../detailOrder';
import { InvoiceDto } from '../invoice';
import { UserDto } from '../user';

export class PurchaseDto{

	@ApiProperty({
		example: 123,
		description: 'Mã đơn hàng'
	})
		id: number;

	@ApiProperty({
		type: UserDto,
		description: 'Người mua'
	})
		user: UserDto;

	@ApiProperty({
		type: InvoiceDto,
		description: 'Hóa đơn'
	})
		invoice: InvoiceDto;

	@ApiProperty({
		isArray: true,
		description: 'Dang sách món hàng mua',
		type: DetailOrderDto
	})
		details: DetailOrderDto[];

	@ApiProperty()
		orderDate: Date;

	@ApiProperty({
		description: 'Tổng tiền',
	})
		summary: number;

	@ApiProperty({
		description: 'Số tiền được giảm',
	})
		discountAmount: number;

	@ApiProperty({
		enum: StatusBuy,
		description: 'Trạng thái đơn hàng',
	})
		status: StatusBuy;
}
