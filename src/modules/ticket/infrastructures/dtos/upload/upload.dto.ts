import { ApiProperty } from '@nestjs/swagger';

export class UploadDto{
	@ApiProperty({
		example: 'assets/upload/products/filename.jpg'
	})
		image: string;

	constructor(image: string) {
		this.image = image;
	}
}
