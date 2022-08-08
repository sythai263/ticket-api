import { Injectable, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ConfigService } from '../../shared/services/config.service';
import { JwtAuthService } from '../jwtAuth/jwtAuth.service';
import { UserLoginDto } from '../user/user.dto';

@Injectable()
export class GoogleAuthService {
	constructor(
		private _jwtService: JwtAuthService,
		private configService: ConfigService,
	) {}

	googleLogin(@Req() req: Request, @Res() res: Response) {
		const user = req.user as UserLoginDto;
		const { token } = user;
		const urlCallback = `${this.configService.get(
			'HOME_URL',
		)}dang-nhap-voi-google?token=${token}`;
		res.redirect(urlCallback);
	}
}
