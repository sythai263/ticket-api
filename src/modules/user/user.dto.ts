import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsFQDN, IsNotEmpty, IsOptional } from 'class-validator';

import { RoleType } from '../../common/constants/roleType';

export class UserDto {

    @ApiProperty({ example: 'thai.ls' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_ALIAS_FIELD' })
		username: string;
	
		@ApiProperty({ example: 'password hash by bcrypt' })
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

    @ApiProperty({ example: 'http://localhost/avatar' })
    @IsFQDN()
    avatar: string;

    @ApiProperty({ enum: RoleType, example: RoleType.USER })
    role: RoleType;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    @IsOptional()
		updatedAt?: Date;
	
		@IsOptional()
		token?: string;

		@IsOptional()
		expiredIn?: Date;

}