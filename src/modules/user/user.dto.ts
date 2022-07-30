import { ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsEmail,
	IsFQDN,
	IsNotEmpty,
	IsOptional,
} from 'class-validator';

import { Gender } from '../../common/constants/gender';
import { RoleType } from '../../common/constants/roleType';

export class UserLoginDto {
  @ApiProperty({ example: 1526 })
  @IsOptional()
  	id?: number;

  @ApiProperty({ example: 'thai.ls' })
  @IsNotEmpty({ message: 'ERROR_EMPTY_ALIAS_FIELD' })
  	username: string;

  @ApiProperty({ example: 'password hash' })
  @IsNotEmpty({ message: 'ERROR_EMPTY_ALIAS_FIELD' })
  	password: string;

  @ApiProperty({ example: 'Thái' })
  @IsNotEmpty({ message: 'ERROR_EMPTY_NAME_FIELD' })
  	firstName: string;

  @ApiProperty({ example: 'Lê Sỹ' })
  @IsNotEmpty({ message: 'ERROR_EMPTY_NAME_FIELD' })
  	lastName: string;

  @ApiProperty({ example: 'thai.ls@geekup.vn' })
  @IsEmail()
  @IsNotEmpty()
  	email: string;

  @ApiProperty({ example: '0984786432' })
  @IsEmail()
  	phone: string;

  @ApiProperty({
  	enum: Gender,
  	example: Gender.MALE,
  })
  	gender: Gender;

  @ApiProperty({ example: 'http://localhost/avatar' })
  @IsFQDN()
  	avatar: string;

  @ApiProperty({ example: new Date() })
  @IsDateString()
  @IsOptional()
  	birthday: Date;

  @ApiProperty({ enum: RoleType, example: RoleType.USER })
  	role: RoleType;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  	createdAt?: Date;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  	updatedAt?: Date;

  @IsOptional()
  @ApiProperty({ example: 'jwt token' })
  	token?: string;

  @IsOptional()
  @ApiProperty({ example: new Date() })
  	expiredIn?: Date;
}
