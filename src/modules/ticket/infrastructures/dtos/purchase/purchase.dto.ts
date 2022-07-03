import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../../../user/user.dto';
import { DetailOrderDto } from '../detailOrder';
import { InvoiceDto } from '../invoice';

export class PurchaseDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		type: UserDto
	})
		user: UserDto;

	@ApiProperty({
		isArray: true,
		type: DetailOrderDto
	})
		details: DetailOrderDto[];

	@ApiProperty({
		type: InvoiceDto
	})
		invoice: InvoiceDto;

}
