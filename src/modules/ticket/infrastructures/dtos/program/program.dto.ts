import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

import { ReviewProgramDto } from '../reviewProgram';

export class ProgramDto {
	@ApiProperty({
		example: 123,
	})
	id: number;

	@ApiProperty({
		example: 'Tên sự kiện',
	})
	name: string;

	@ApiProperty({
		example: new Date(),
	})
	@IsDateString()
	startDate: Date;

	@ApiProperty({
		example: new Date(),
	})
	@IsDateString()
	endDate: Date;

	@ApiProperty({
		example: 150,
	})
	total: number;

	@ApiProperty({
		example: 92,
	})
	remain: number;

	@ApiProperty({
		example: 99000,
	})
	price?: number = 0;

	@ApiProperty({
		example: 'http://localhost/avatar',
	})
	avatar: string;

	@ApiProperty({
		example: 'Địa điểm tổ chức',
	})
	@IsString()
	place?: string;

	@ApiProperty({
		example: 'Mô tả sự kiện',
	})
	description: string;

	@ApiProperty({
		example: 'image/qrcode.png',
	})
	imageQR: string;

	@ApiProperty({
		example: true,
	})
	allowCheckIn: boolean;

	@ApiProperty({
		type: ReviewProgramDto,
		isArray: true,
	})
	reviews: ReviewProgramDto[];

	@ApiProperty({
		example: 5,
	})
	starAvg?: number = 5;

	@ApiProperty({
		example: true,
	})
	isRegister: boolean;
}
