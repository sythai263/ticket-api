import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateAttendeeDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		programId: number;

	@ApiProperty({
		example: 10
	})
	@IsNumber()
	@IsOptional()
		userId?: number;

}
