import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class UpdateReviewProgramDto {
	userId?: number;

	@ApiProperty({
		example: 2,
	})
	@IsNumber()
	id: number;

	@ApiProperty({
		example: 5,
	})
	@IsNumber()
	@Min(0, {
		message: 'Số sao đánh giá phải từ  0 đến 5',
	})
	@Max(5, {
		message: 'Số sao đánh giá phải từ  0 đến 5',
	})
	star: number;

	@ApiProperty({
		example: ' Very good!!',
	})
	@IsString()
	comment: string;
}
