import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { GoogleAuthService } from './google-auth.service';

@Controller('api/google')
export class GoogleAuthController {
	constructor(private readonly googleService: GoogleAuthService) {}

  @Get('auth')
  @UseGuards(AuthGuard('google'))
	googleAuth(@Req() req: Request) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
  	return this.googleService.googleLogin(req);
  }
}
