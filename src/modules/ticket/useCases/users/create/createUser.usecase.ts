import { Inject, Injectable } from '@nestjs/common';

import { RoleType } from '../../../../../common/constants/roleType';
import { SYSTEM } from '../../../../../common/constants/system';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { UserLoginDto } from '../../../../user/user.dto';
import { CreateUserDto } from '../../../infrastructures/dtos/user/createUser.dto';
import { UserMap } from '../../../mapper/user.mapper';
import { UserRepository } from '../../../repositories/user.repo';
import { GetUserErrors } from '../user.error';

type Response = Either<
	AppError.UnexpectedError | GetUserErrors.UserNotFound | GetUserErrors.ErrorUser,
	Result<UserLoginDto>
>;

@Injectable()
export class CreateUserUsecase implements IUseCase<CreateUserDto, Promise<Response>> {
	constructor(@Inject('UserRepository') public readonly repo: UserRepository) {}

	async execute(userDto: CreateUserDto): Promise<Response> {
		let user = await this.repo.findByUsername(userDto.username);
		if (user) {
			return left(new GetUserErrors.ErrorUser('Tài khoản này đã tồn tại!'));
		}

		user = UserMap.dtoToDomain(userDto);
		if (!user.confirmPassword(userDto.rePassword)) {
			return left(new GetUserErrors.ErrorPassword('Xác nhận mật khẩu không khớp !'));
		}

		if (!user.checkPhoneValid()) {
			return left(new GetUserErrors.ErrorUser('Số điện thoại không hợp lệ!'));
		}

		user.hashPassword(user.password);
		user.role = RoleType.USER;
		const entity = UserMap.toEntity(user);
		entity.createdBy = SYSTEM;
		entity.updatedBy = SYSTEM;
		user = await this.repo.save(entity);
		if (!user) {
			return left(new GetUserErrors.ErrorPassword('Số điện thoại hoặc email đã được sử dụng !'));
		}

		return right(Result.ok(UserMap.toDto(user)));
	}
}
