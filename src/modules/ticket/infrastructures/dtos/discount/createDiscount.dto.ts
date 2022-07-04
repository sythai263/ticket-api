import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateDiscountDto{

	@ApiProperty({
		example: 10
	})
	@IsNumber()
		programId: number;

	@ApiProperty({
		example: new Date()
	})
	@IsDateString()
		startDate: Date;

	@ApiProperty({
		example: new Date()
	})
	@IsDateString()
		expiredDate: Date;

	@ApiProperty({
		example: 5,
		description:'Unit %'
	})
	@IsNumber()
		discount: number;

	@ApiProperty({
		example: 'Mô tả mã giảm giá'
	})
	@IsString()
		description: string;

}
