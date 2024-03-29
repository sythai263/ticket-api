import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Min } from 'class-validator';

import { UserShortDto } from '../user';

export class ReviewProgramDto {
	@ApiProperty({
		example: 123,
	})
	id: number;

	@ApiProperty({
		type: UserShortDto,
	})
	user: UserShortDto;

	@ApiProperty()
	createAt: Date;

	@ApiProperty()
	@Min(0)
	star: number;

	@ApiProperty()
	@IsString()
	comment: string;

	@ApiProperty()
	@IsBoolean()
	canUpdate: boolean;
}
