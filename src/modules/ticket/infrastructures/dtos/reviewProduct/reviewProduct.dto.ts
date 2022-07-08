import { ApiProperty } from '@nestjs/swagger';
import { IsString, Min } from 'class-validator';

import { InvoiceDto } from '../invoice';
import { ProductDto } from '../product';
import { UserDto } from '../user';

export class ReviewProductDto{

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
		type: ProductDto
	})
		product: ProductDto;

	@ApiProperty({
		type: InvoiceDto
	})
	@Min(0)
		star: number;

	@ApiProperty()
	@IsString()
		comment: string;

}
