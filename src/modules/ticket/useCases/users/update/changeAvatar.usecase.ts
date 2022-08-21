import { Inject, Injectable } from '@nestjs/common';

import { ModeImage } from '../../../../../common/constants/modeImage';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { saveImage } from '../../../../../utils/saveImage';
import { UserShortDto } from '../../../infrastructures/dtos/user';
import { UserMap } from '../../../mapper';
import { UserRepository } from '../../../repositories/user.repo';
import { GetUserErrors } from '../user.error';

type Response = Either<AppError.UnexpectedError | GetUserErrors.UserNotFound, Result<UserShortDto>>;

@Injectable()
export class ChangeAvatarUserUseCase implements IUseCase<Express.Multer.File, Promise<Response>> {
	constructor(@Inject('UserRepository') public readonly repo: UserRepository) {}

	async execute(avatar: Express.Multer.File, userId: number): Promise<Response> {
		const user = await this.repo.findById(userId);
		if (!user) {
			return left(new GetUserErrors.UserNotFound());
		}

		const url = await saveImage(avatar, ModeImage.AVATAR);
		user.avatar = url;
		const entity = UserMap.toEntity(user);
		entity.updatedBy = userId;
		await this.repo.save(entity);
		return right(Result.ok(UserMap.toShortDto(user)));
	}
}
