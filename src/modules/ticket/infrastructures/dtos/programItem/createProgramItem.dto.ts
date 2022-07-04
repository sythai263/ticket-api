import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateProgramItemDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		programId: number;

	@ApiProperty({
		isArray: true
	})
		productIds: number[];

}
