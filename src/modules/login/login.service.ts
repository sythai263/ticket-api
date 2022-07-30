import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

import { IUseCase } from '../../core/domain/UseCase';
import { AppError } from '../../core/logic/AppError';
import { Either, left, Result, right } from '../../core/logic/Result';
import { ConfigService } from '../../shared/services/config.service';
import { JwtAuthService } from '../jwtAuth/jwtAuth.service';
import { UserLoginDto } from '../user/user.dto';
import { GetUserErrors } from '../user/user.error';
import { IUserAuthRepo } from '../user/user.repo';
import { LoginDto } from './login.dto';

type Response = Either<
  | AppError.UnexpectedError
  | GetUserErrors.UserNotFound
  | GetUserErrors.PasswordWrong,
  Result<UserLoginDto>
>;
@Injectable()
export class LoginService implements IUseCase<LoginDto, Promise<Response>> {
	constructor(
    private configService: ConfigService,
    private jwtService: JwtAuthService,
    @Inject('IUserAuthRepo') public readonly repo: IUserAuthRepo,
	) {}

	async execute(request?: LoginDto, actor?: number): Promise<Response> {
		const user = await this.repo.findByUsername(request.username);
		if (user) {
			const isVerify = bcrypt.compareSync(request.password, user.password);
			if (isVerify) {
				const expiredIn = this.configService.getNumber('JWT_EXPIRES_IN');
				user.token = this.jwtService.signJwt(user);
				user.expiredIn = moment().add(expiredIn, 'd').toDate();
				user.password = undefined;
				user.email = undefined;
				return right(Result.ok(user));
			}

			return left(new GetUserErrors.PasswordWrong());
		}

		return left(new GetUserErrors.UserNotFound());
	}
}
