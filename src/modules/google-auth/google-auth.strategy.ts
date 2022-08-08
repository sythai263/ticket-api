/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import * as moment from 'moment';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AppError } from '../../core/logic/AppError';
import { ConfigService } from '../../shared/services/config.service';
import { JwtAuthService } from '../jwtAuth/jwtAuth.service';
import { UserLoginDto } from '../user/user.dto';
import { GetUserErrors } from '../user/user.error';
import { GetUserUseCase } from '../user/user.usecase';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
    private configService: ConfigService,
    private jwtService: JwtAuthService,
    public readonly useCase: GetUserUseCase,
	) {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: process.env.GOOGLE_REDIRECT,
			scope: ['email', 'profile'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		const { name, emails, photos } = profile;
		const user = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken,
		};
		const expiredIn = this.configService.getNumber('JWT_EXPIRES_IN');
		let userDto = new UserLoginDto();
		userDto.avatar = user.picture;
		userDto.email = user.email;
		userDto.lastName = user.lastName;
		userDto.firstName = user.firstName;
		userDto.username = user.email;

		const result = await this.useCase.execute(userDto);
		if (result.isLeft()) {
			const error = result.value;

			// eslint-disable-next-line default-case
			switch (error.constructor) {
				case GetUserErrors.UserNotFound:
					done('not found', null);
					break;
				case AppError.UnexpectedError:
					done('exception', null);
			}
		} else {
			userDto = result.value.getValue();
			userDto.token = this.jwtService.signJwt(userDto);
			userDto.expiredIn = moment().add(expiredIn, 'd').toDate();
			done(null, userDto);
		}
	}
}
