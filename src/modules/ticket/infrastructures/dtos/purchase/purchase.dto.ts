import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../../../user/user.dto';
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
		type: InvoiceDto
	})
		invoice: InvoiceDto;

	@ApiProperty()
		orderDate: Date;

}
