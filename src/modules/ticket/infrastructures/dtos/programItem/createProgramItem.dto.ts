import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CreateProgramItemDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		programId: number;

	@ApiProperty({
		isArray: true,
		example: [1, 2, 3]
	})
	@IsArray()
		productIds: number[];

}
