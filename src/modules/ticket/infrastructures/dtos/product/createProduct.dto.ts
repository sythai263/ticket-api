import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto{

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
