import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { Gender } from '../../../../../common/constants/gender';

export class CreateUserDto {

	@ApiProperty({ example: 'Thái' })
	@IsString()
	@MinLength(4)
	@MaxLength(255)
	@Matches(/^[a-z0-9_\.]+$/, {
		message: 'Invalid username'
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
	@Matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
		{
			message: 'Invalid phone number'
		})
  	phone?: string;

	@ApiProperty({
		enum: Gender,
		example: Gender.MALE
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
