import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { Gender } from '../../../../../common/constants/gender';

export class CreateUserDto {
	@ApiProperty({ example: 'Thái' })
	@IsString()
	@MinLength(4)
	@MaxLength(255)
	@Matches(/^[a-z0-9_\.]+$/, {
		message: 'Tên tài khoản không hợp lệ',
	})
	username?: string;

	@IsOptional()
	@ApiProperty({ example: 'Thái' })
	firstName?: string;

	@IsOptional()
	@ApiProperty({ example: 'Lê Sỹ' })
	lastName?: string;

	@IsOptional()
	@ApiProperty({ example: 'thai.ls@geekup.vn' })
	@IsEmail()
	email?: string;

	@ApiProperty({ example: '0984786432' })
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiProperty({
		enum: Gender,
		example: Gender.MALE,
	})
	@IsOptional()
	gender?: Gender;

	@ApiProperty({ example: 'http://localhost/avatar' })
	@IsOptional()
	avatar?: string;

	@ApiProperty({ example: new Date() })
	@IsDateString()
	@IsOptional()
	birthday?: Date;

	@ApiProperty({ example: 'Passwordok1qq' })
	@IsString()
	@MinLength(8, { message: 'Mật khẩu phải từ 8 - 20 ký tự !' })
	@MaxLength(20, { message: 'Mật khẩu phải từ 8 - 20 ký tự !' })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: ' Mật khẩu không đủ mạnh' })
	password: string;

	@ApiProperty({ example: 'Passwordok1qq' })
	@IsString()
	@MinLength(8, { message: 'Mật khẩu phải từ 8 - 20 ký tự !' })
	@MaxLength(20, { message: 'Mật khẩu phải từ 8 - 20 ký tự !' })
	rePassword: string;
}
