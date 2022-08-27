import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { UserDto } from '../../../infrastructures/dtos/user';
import { UserMap } from '../../../mapper/user.mapper';
import { UserRepository } from '../../../repositories/user.repo';
import { GetUserErrors } from '../user.error';

type Response = Either<AppError.UnexpectedError | GetUserErrors.UserNotFound, Result<UserDto>>;

@Injectable()
export class GetUserUseCase implements IUseCase<string, Promise<Response>> {
	constructor(@Inject('UserRepository') public readonly repo: UserRepository) {}

	async execute(username: string): Promise<Response> {
		const user = await this.repo.findByUsername(username);
		if (!user) {
			return left(new GetUserErrors.UserNotFound());
		}

		const dto = UserMap.toDto(user);
		return right(Result.ok(dto));
	}
}
