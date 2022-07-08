import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProgramDto{

	@ApiProperty({
		example: 10
	})
		@IsOptional()
	@IsNumber()
		id?: number;

	@ApiProperty({
		example: 'Tên sự kiện'
	})
	@IsOptional()
	@IsString()
		name?: string;

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
		endDate?: Date;

	@ApiProperty({
		example: 150
	})
	@IsOptional()
	@IsInt()
		total?: number;

	@ApiProperty({
		example: 99000
	})
	@IsOptional()
	@IsInt()
		price?: number;

	@ApiProperty({
		example: 'Địa điểm tổ chức'
	})
	@IsString()
		place?: string;

	@ApiProperty({
		example: 'http://localhost/avatar'
	})
	@IsOptional()
	@IsString()
		avatar?: string;

	@ApiProperty({
		example: 'Mô tả sự kiện'
	})
	@IsOptional()
	@IsString()
		description?: string;

}
