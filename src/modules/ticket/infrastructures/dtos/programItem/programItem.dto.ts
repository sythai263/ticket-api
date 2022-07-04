import { ApiProperty } from '@nestjs/swagger';

import { ProductDto } from '../product';
import { ProgramDto } from '../program';

export class ProgramItemDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		type: ProgramDto
	})
		program: ProgramDto;

	@ApiProperty({
		type: ProductDto
	})
		product: ProductDto;

}
