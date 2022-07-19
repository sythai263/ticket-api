import { ApiProperty } from '@nestjs/swagger';
import { IsString, Min } from 'class-validator';

import { UserDto } from '../user';

export class ReviewProductDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		type: UserDto
	})
		user: UserDto;

	@ApiProperty()
	@Min(0)
		star: number;

	@ApiProperty()
	@IsString()
		comment: string;

}
