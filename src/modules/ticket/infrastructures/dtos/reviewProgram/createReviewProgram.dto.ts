import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewProgramDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		userId: number;

	@ApiProperty({
		example: 2
	})
	@IsNumber()
		programId: number;

	@ApiProperty({
		example: 5
	})
	@IsNumber()
	@Min(0, {
		message: 'Rate star must be 0 <= star <= 5'
	})
	@Max(5, {
		message: 'Rate star must be 0 <= star <= 5'
	})
		star: number;

	@ApiProperty({
		example: ' Very good!!'
	})
	@IsString()
		comment: string;

}
