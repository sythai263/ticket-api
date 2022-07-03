import { ApiProperty } from '@nestjs/swagger';

import { ProgramDto } from '../program';

export class DiscountDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		type: ProgramDto
	})
		program: ProgramDto;

	@ApiProperty({
		example: new Date()
	})
		startDate: Date;

	@ApiProperty({
		example: new Date()
	})
		expiredDate: Date;

	@ApiProperty({
		example: 5,
		description: 'Unit %'

	})
		discount: number;

	@ApiProperty({
		example: 'Mô tả mã giảm giá'
	})
		description: string;

}
