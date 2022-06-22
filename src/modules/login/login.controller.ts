import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { LoginDto } from './login.dto';
import { LoginService } from './login.service';

@Controller('api/login')
@ApiTags('Login')
export class LoginController {
	constructor(private readonly loginService: LoginService) { }

	@Post('')
	login(@Body() loginDto: LoginDto,
		@Req() req: Request) {

	}
}
