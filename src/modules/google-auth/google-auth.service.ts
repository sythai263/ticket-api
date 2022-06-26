import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthService } from '../jwtAuth/jwtAuth.service';

@Injectable()
export class GoogleAuthService {
	constructor(private _jwtService: JwtAuthService) {}

	googleLogin(@Req() req: Request) {
		return {
			user: req.user,
		};
	}
}
