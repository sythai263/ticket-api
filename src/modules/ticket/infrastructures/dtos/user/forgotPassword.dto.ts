import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ForgotPasswordDto {
	@ApiProperty({ example: 'username' })
	@IsString()
	@MinLength(4)
	@MaxLength(255)
	@Matches(/^[a-z0-9_\.]+$/, {
		message: 'Tài khoản không hợp lệ !',
	})
	username: string;

	@ApiProperty({ example: 'thai.ls@geekup.vn' })
	@IsEmail()
	email?: string;

	@ApiProperty({ example: 'Thái' })
	@IsString()
	firstName?: string;

	@ApiProperty({ example: 'Lê Sỹ' })
	@IsString()
	lastName?: string;
}
