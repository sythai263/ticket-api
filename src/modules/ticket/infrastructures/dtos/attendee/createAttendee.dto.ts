import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateAttendeeDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		programId: number;

	userId?: number;
	username?: string;

}
