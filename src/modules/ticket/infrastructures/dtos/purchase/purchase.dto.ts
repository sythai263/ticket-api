import { ApiProperty } from '@nestjs/swagger';

import { InvoiceDto } from '../invoice';
import { UserDto } from '../user';

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
