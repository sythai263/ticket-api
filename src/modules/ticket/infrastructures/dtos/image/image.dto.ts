import { ApiProperty } from '@nestjs/swagger';

export class ImageDto{

	@ApiProperty({
		example: 123
	})
		id?: number;

	@ApiProperty({
		example: 'http://locahost:3000/url'
	})
		url: string;

	@ApiProperty({
		example: 'Mô tả hình ảnh'
	})
		alt?: string;

	constructor(url?: string) {
		this.url = url;
	}

}
