import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto{

	@ApiProperty({
		example: 10
	})
		@IsOptional()
	@IsNumber()
		id?: number;

	@ApiProperty({
		example: 'Tên sản phẩm'
	})
	@IsString()
		name: string;

	@ApiProperty({
		example: 150
	})
	@IsNumber()
		total: number;

	@ApiProperty({
		example: 99000
	})
	@IsNumber()
		price: number;

	@ApiProperty({
		example: 'http://localhost/avatar'
	})
	@IsString()
		avatar: string;

	@ApiProperty({
		example: 'Mô tả sản phẩm'
	})
	@IsString()
		description: string;

}
