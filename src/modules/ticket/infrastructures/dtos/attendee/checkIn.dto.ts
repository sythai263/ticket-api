import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CheckInAttendeeDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		program: number;

	@ApiProperty({
		example: 1
	})
	@IsNumber()
		user?: number;

	@ApiProperty({
		example: 1
	})
	@IsNumber()
		attendee?: number;

	@ApiProperty({
		example: 1
	})
	@IsNumber()
		name?: number;

}
