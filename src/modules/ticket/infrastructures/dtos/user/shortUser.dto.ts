import { ApiProperty } from '@nestjs/swagger';
import { IsFQDN, IsNotEmpty } from 'class-validator';

export class UserShortDto {
	@ApiProperty({ example: 'Thái' })
	@IsNotEmpty({ message: 'ERROR_EMPTY_NAME_FIELD' })
	firstName: string;

	@ApiProperty({ example: 'Lê Sỹ' })
	@IsNotEmpty({ message: 'ERROR_EMPTY_NAME_FIELD' })
	lastName: string;

	@ApiProperty({ example: 'http://localhost/avatar' })
	@IsFQDN()
	avatar: string;
}
