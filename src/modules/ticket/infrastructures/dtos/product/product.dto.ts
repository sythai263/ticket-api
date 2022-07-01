import { ApiProperty } from '@nestjs/swagger';

export class ProductDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		example: 'Tên sản phẩm'
	})
		name: string;

	@ApiProperty({
		example: 150
	})
		total: number;

	@ApiProperty({
		example: 150
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
		example: 'Mô tả sản phẩm'
	})
		description: string;

}
