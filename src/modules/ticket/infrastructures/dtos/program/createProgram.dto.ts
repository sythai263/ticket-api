import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateProgramDto{

	@ApiProperty({
		example: 'Tên sự kiện'
	})
	@IsString()
		name?: string;

	@ApiProperty({
		example: new Date()
	})
	@IsDateString()
		startDate?: Date;

	@ApiProperty({
		example: new Date()
	})
	@IsDateString()
		endDate?: Date;

	@ApiProperty({
		example: 150
	})
	@IsInt()
		total?: number;

	@ApiProperty({
		example: 99000
	})
	@IsInt()
		price?: number;

	@ApiProperty({
		example: 'http://localhost/avatar'
	})
	@IsString()
		avatar?: string;

	@ApiProperty({
		example: 'Mô tả sự kiện'
	})
	@IsString()
		description?: string;

}
