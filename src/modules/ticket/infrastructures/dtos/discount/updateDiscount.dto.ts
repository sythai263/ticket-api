import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto{

	@ApiProperty({
		example: 10
	})
	@IsOptional()
	@IsNumber()
		id?: number;

	@ApiProperty({
		example: 10
	})
	@IsOptional()
	@IsNumber()
		programId?: number;

	@ApiProperty({
		example: new Date()
	})
	@IsOptional()
	@IsDateString()
		startDate?: Date;

	@ApiProperty({
		example: new Date()
	})
	@IsOptional()
	@IsDateString()
		expiredDate?: Date;

	@ApiProperty({
		example: 5,
		description:'Unit %'
	})
	@IsOptional()
	@IsNumber()
		discount?: number;

	@ApiProperty({
		example: 'Mô tả mã giảm giá'
	})
	@IsOptional()
	@IsString()
		description?: string;

}
