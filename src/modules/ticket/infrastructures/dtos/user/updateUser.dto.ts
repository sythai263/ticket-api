import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional } from 'class-validator';

import { Gender } from '../../../../../common/constants/gender';

export class UpdateUserDto {

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

}
