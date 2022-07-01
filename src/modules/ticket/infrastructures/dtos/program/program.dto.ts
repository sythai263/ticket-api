import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class ProgramDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		example: 'Tên sự kiện'
	})
		name: string;

	@ApiProperty({
		example: new Date()
	})
	@IsDateString()
		startDate: Date;

	@ApiProperty({
		example: new Date()
	})
	@IsDateString()
		endDate: Date;

	@ApiProperty({
		example: 150
	})
		total: number;

	@ApiProperty({
		example: 92
	})
		remain: number;

	@ApiProperty({
		example: 99000
	})
		price: number;

	@ApiProperty({
		example: 'http://localhost/avatar'
	})
		avatar: string;

	@ApiProperty({
		example: 'Mô tả sự kiện'
	})
		description: string;

}
