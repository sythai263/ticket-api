import { ApiProperty } from '@nestjs/swagger';
import { IsString, Min } from 'class-validator';

import { InvoiceDto } from '../invoice';
import { ProgramDto } from '../program';
import { UserDto } from '../user';

export class ReviewProgramDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		type: UserDto
	})
		user: UserDto;

	@ApiProperty({
		isArray: true,
		type: ProgramDto
	})
		program: ProgramDto;

	@ApiProperty({
		type: InvoiceDto
	})
	@Min(0)
		star: number;

	@ApiProperty()
	@IsString()
		comment: string;

}
