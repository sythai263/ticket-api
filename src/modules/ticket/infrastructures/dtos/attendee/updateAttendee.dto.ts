import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateAttendeeDto{

	@ApiProperty({
		example: 10,
		description: 'ID chương trình'
	})
	@IsNumber()
		programId: number;

}
