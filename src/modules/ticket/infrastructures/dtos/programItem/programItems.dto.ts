import { ApiProperty } from '@nestjs/swagger';

import { ProductDto } from '../product';
import { ProgramDto } from '../program';

export class ProgramItemsDto{

	@ApiProperty({
		type: ProgramDto
	})
		program: ProgramDto;

	@ApiProperty({
		type: ProductDto,
		isArray: true
	})
		product: ProductDto[];

	constructor(program: ProgramDto, products: ProductDto[]) {
		this.product = products;
		this.program = program;
	}

}
