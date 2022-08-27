import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { GoogleAuthService } from './google-auth.service';

@Controller('api/google')
@ApiTags('Google Auth')
export class GoogleAuthController {
	constructor(private readonly googleService: GoogleAuthService) {}

	@Get('auth')
	@UseGuards(AuthGuard('google'))
	googleAuth(@Req() req: Request) {}

	@Get('redirect')
	@ApiCreatedResponse({
		description: 'Google Auth trả kết quả',
	})
	@UseGuards(AuthGuard('google'))
	googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		return this.googleService.googleLogin(req, res);
	}
}
