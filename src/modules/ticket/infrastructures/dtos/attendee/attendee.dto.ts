import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { InvoiceDto } from '../invoice';
import { ProgramDto } from '../program';
import { UserDto, UserShortDto } from '../user';

export class AttendeeDto {
	@ApiProperty({
		example: 123,
		description: 'Mã đăng ký tham gia',
	})
	id: number;

	@ApiProperty({
		type: ProgramDto,
		description: 'Chương trình người dùng đăng ký tham gia',
	})
	program: ProgramDto;

	@ApiProperty({
		type: UserDto,
		description: 'Người dùng nào tham gia',
	})
	user: UserShortDto;

	@ApiProperty({
		type: InvoiceDto,
		description: 'Hóa đơn cho đơn đăng ký',
	})
	@IsOptional()
	invoice?: InvoiceDto;

	@ApiProperty({
		example: 'https://localhost/qrcode1',
		description: 'Mã QR chứa thông tin đăng ký',
	})
	imageQR: string;

	@ApiProperty({
		example: true,
		description: 'Đã check-in chưa',
	})
	isCheckIn: boolean;
}
