import { ApiProperty } from '@nestjs/swagger';

export class CheckAttendee {
	@ApiProperty({
		example: true,
		description: 'Đã tham gia chưa',
	})
	isRegister: boolean;

	constructor(result: boolean) {
		this.isRegister = result;
	}
}
