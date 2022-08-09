import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

import { Gender } from '../../../../../common/constants/gender';

export class UpdateUserDto {
	@IsOptional()
	@ApiProperty({ example: 'Thái' })
	firstName?: string;

	@IsOptional()
	@ApiProperty({ example: 'Lê Sỹ' })
	@IsString()
	lastName?: string;

	@IsOptional()
	@ApiProperty({ example: 'thai.ls@geekup.vn' })
	@IsEmail()
	email?: string;

	@ApiProperty({ example: '0984786432' })
	@IsString()
	phone?: string;

	@ApiProperty({
		enum: Gender,
		example: Gender.MALE,
	})
	@IsOptional()
	@IsString()
	gender?: Gender;

	@ApiProperty({ example: new Date() })
	@IsDateString()
	@IsOptional()
	birthday?: Date;
}
