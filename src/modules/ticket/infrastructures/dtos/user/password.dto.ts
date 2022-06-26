import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class PasswordDto {

	@ApiProperty({ example: 'old password no hash' })
	@IsString()
		oldPassword: string;

	@ApiProperty({ example: 'new password no hash' })
	@IsString()
	@MinLength(8)
	@MaxLength(20)
	@Matches(
		/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
		{ message:'Password too weak !' }
	)
		password: string;

	@ApiProperty({ example: 're password no hash' })
	@IsString()
	@MinLength(8)
	@MaxLength(20)
		rePassword: string;

}
