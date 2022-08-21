import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { UserShortDto } from '../../../infrastructures/dtos/user';
import { PasswordDto } from '../../../infrastructures/dtos/user/password.dto';
import { UserMap } from '../../../mapper/user.mapper';
import { UserRepository } from '../../../repositories/user.repo';
import { GetUserErrors } from '../user.error';

type Response = Either<AppError.UnexpectedError | GetUserErrors.UserNotFound, Result<UserShortDto>>;

@Injectable()
export class ChangePasswordUseCase implements IUseCase<PasswordDto, Promise<Response>> {
	constructor(@Inject('UserRepository') public readonly repo: UserRepository) {}

	async execute(passwordDto: PasswordDto, userId: number): Promise<Response> {
		let user = await this.repo.findById(userId);
		if (!user) {
			return left(new GetUserErrors.UserNotFound());
		}

		const check = user.changePassword(passwordDto.oldPassword, passwordDto.password, passwordDto.rePassword);
		switch (check) {
			case 0:
				const entity = UserMap.toEntity(user);
				entity.updatedBy = user.id.toValue();
				user = await this.repo.save(entity);
				const dto = UserMap.toShortDto(user);

				return right(Result.ok(dto));
			case 1:
				return left(new GetUserErrors.ErrorPassword('Sai mật khẩu !'));
			case 2:
				return left(new GetUserErrors.ErrorPassword('Mật khẩu không hợp lệ !'));
			default:
				return left(new GetUserErrors.ErrorPassword('Mật khẩu không để trống !'));
		}
	}
}
