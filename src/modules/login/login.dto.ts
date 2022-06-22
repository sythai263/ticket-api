import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {

    @ApiProperty({ example: 'thai.ls' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_ALIAS_FIELD' })
		username: string;

		@ApiProperty({ example: 'password hash by bcrypt' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_ALIAS_FIELD' })
    password: string;

}
