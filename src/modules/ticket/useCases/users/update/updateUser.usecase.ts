import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { UserDomain } from '../../../../../domain/user.domain';
import { UserLoginDto } from '../../../../user/user.dto';
import { UpdateUserDto } from '../../../infrastructures/dtos/user/updateUser.dto';
import { UserMap } from '../../../mapper/user.mapper';
import { UserRepository } from '../../../repositories/user.repo';
import { GetUserErrors } from '../user.error';

type Response = Either<
  AppError.UnexpectedError | GetUserErrors.UserNotFound,
  Result<UserLoginDto>
>;

@Injectable()
export class UpdateUserUseCase implements IUseCase<UpdateUserDto, Promise<Response>> {
	constructor(@Inject('UserRepository') public readonly repo: UserRepository) {}

	async execute(userDto: UpdateUserDto, userId: number): Promise<Response> {
		let user = await this.repo.findById(userId);
		if (!user) {
			return left(new GetUserErrors.UserNotFound());
		}

		user = this.checkChange(user, userDto);
		const entity = UserMap.toEntity(user);
		entity.updatedBy = user.id.toValue();
		user = await this.repo.save(entity);
		const dto = UserMap.toDto(user);

		return right(Result.ok(dto));
	}

	checkChange(user: UserDomain, dto: UpdateUserDto): UserDomain {
		user.changeBirthday(dto.birthday);
		user.changeEmail(dto.email);
		user.changeFirstName(dto.firstName);
		user.changeGender(dto.gender);
		user.changeLastName(dto.lastName);
		user.changePhone(dto.phone);
		return user;
	}
}
