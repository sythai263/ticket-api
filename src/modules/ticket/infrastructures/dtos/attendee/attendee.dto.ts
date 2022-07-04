import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { UserDto } from '../../../../user/user.dto';
import { InvoiceDto } from '../invoice';
import { ProgramDto } from '../program';

export class AttendeeDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		type: ProgramDto
	})
		program: ProgramDto;

	@ApiProperty({
		type: UserDto
	})
		user: UserDto;

	@ApiProperty({
		type: InvoiceDto
	})
	@IsOptional()
		invoice?: InvoiceDto;

	@ApiProperty({
		example: 'https://localhost/qrcode1'

	})
		imageQR: string;

}
