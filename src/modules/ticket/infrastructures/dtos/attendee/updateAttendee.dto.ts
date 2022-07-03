import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateAttendeeDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		programId: number;

}
