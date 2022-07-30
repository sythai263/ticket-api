import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../core/domain/UseCase';
import { AppError } from '../../core/logic/AppError';
import { Either, left, Result, right } from '../../core/logic/Result';
import { UserLoginDto } from './user.dto';
import { GetUserErrors } from './user.error';
import { UserAuthMap } from './user.mapper';
import { IUserAuthRepo } from './user.repo';

type Response = Either<
  AppError.UnexpectedError | GetUserErrors.UserNotFound,
  Result<UserLoginDto>
>;

@Injectable()
export class GetUserUseCase
implements IUseCase<UserLoginDto, Promise<Response>>
{
	constructor(@Inject('IUserAuthRepo') public readonly repo: IUserAuthRepo) {}

	async execute(userDto: UserLoginDto): Promise<Response> {
		try {
			const foundUser = await this.repo.findByEmail(userDto.email);
			if (foundUser) {
				return right(Result.ok(foundUser));
			}

			const entity = await UserAuthMap.dtoToEntity(userDto);
			entity.verify = true;
			const user = await this.repo.save(entity);
			return right(Result.ok(user));
		} catch (err) {
			return left(new AppError.UnexpectedError(err));
		}
	}
}
