import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class PasswordDto {
	@ApiProperty({ example: 'old password no hash' })
	@IsString()
	oldPassword: string;

	@ApiProperty({ example: 'new password no hash' })
	@IsString()
	@MinLength(8, { message: 'Mật khẩu phải từ 8 - 20 ký tự ! ' })
	@MaxLength(20, { message: 'Mật khẩu phải từ 8 - 20 ký tự ! ' })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Mật khẩu quá yếu! ' })
	password: string;

	@ApiProperty({ example: 're password no hash' })
	@IsString()
	@MinLength(8, { message: 'Mật khẩu nhắc lại phải từ 8 - 20 ký tự ! ' })
	@MaxLength(20, { message: 'Mật khẩu nhắc lại phải từ 8 - 20 ký tự ! ' })
	rePassword: string;
}
