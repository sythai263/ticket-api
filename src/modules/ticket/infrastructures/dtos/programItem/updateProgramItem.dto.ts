import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateProgramItemDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		programId: number;

	@ApiProperty({
		isArray: true,
		description: 'Mảng các id sản phẩm có bán trong program',
		example: [1, 2, 3, 4]
	})
		productIds: number[];

}
