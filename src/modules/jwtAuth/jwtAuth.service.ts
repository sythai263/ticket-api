import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '../../shared/services/config.service';
import { UserDto } from '../user/user.dto';
import { JwtPayload } from './jwtAuth.strategy';
@Injectable()
export class JwtAuthService {
	constructor(
    private _jwtService: JwtService,
    protected configService: ConfigService,
	) {}

	signJwt(user: UserDto): string {
		const payload = {
			username: user.username,
			role: user.role,
			id: user.id
		} as JwtPayload;
		return this._jwtService.sign(payload, {
			expiresIn: `${this.configService.get('JWT_EXPIRES_IN')}d`,
		});
	}
}
