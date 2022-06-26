import { ApiProperty } from '@nestjs/swagger';

export class SuccessNotification{
	@ApiProperty({
		example: 'Delete successfully'
	})
		message: string;

	@ApiProperty({
		example: 201
	})
		statusCode: number;

	constructor(message: string, statusCode: number) {
		this.message = message;
		this.statusCode = statusCode;
	}
}
