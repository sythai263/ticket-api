import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { UserRepository } from '../../../repositories/user.repo';
import { GetUserErrors } from '../user.error';

type Response = Either<AppError.UnexpectedError | GetUserErrors.UserNotFound, Result<boolean>>;

@Injectable()
export class DeleteUserUsecase implements IUseCase<string, Promise<Response>> {
	constructor(@Inject('UserRepository') public readonly repo: UserRepository) {}

	async execute(username: string, userId?: number): Promise<Response> {
		const isSuccess = await this.repo.softDelete(
			{
				username,
			},
			userId,
		);
		if (!isSuccess) {
			return left(new GetUserErrors.ErrorUser('Không thể xóa tài khoản này !'));
		}

		return right(Result.ok(isSuccess));
	}
}
