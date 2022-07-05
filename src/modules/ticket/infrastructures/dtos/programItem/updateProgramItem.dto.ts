import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateProgramItemDto{

	id?: number;

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		programId: number;

	@ApiProperty({
		isArray: true,
		example: 1
	})
	@IsNumber()
		productId: number;

}
