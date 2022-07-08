import {
	BadRequestException,
	Body,
	Controller,
	InternalServerErrorException,
	NotFoundException,
	Post,
	Req
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { UserLoginDto } from '../user/user.dto';
import { GetUserErrors } from '../user/user.error';
import { LoginDto } from './login.dto';
import { LoginService } from './login.service';

@Controller('api/login')
@ApiTags('Login')
export class LoginController {
	constructor(private readonly loginService: LoginService) {}

  @Post('')
  @ApiCreatedResponse({
  	type: UserLoginDto,
  	description: 'Login successfully !',
  })
	async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
	): Promise<UserLoginDto> {
		const result = await this.loginService.execute(loginDto);
		if (result.isLeft()) {
			const error = result.value;
			switch (error.constructor) {
			case GetUserErrors.UserNotFound:
				throw new NotFoundException(error.errorValue());
			case GetUserErrors.PasswordWrong:
				throw new BadRequestException(error.errorValue());
			default:
				throw new InternalServerErrorException(error.errorValue());
			}
		}

		return result.value.getValue();
	}
}
