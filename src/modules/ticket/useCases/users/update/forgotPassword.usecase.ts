
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as generator from 'generate-password';

import { SYSTEM } from '../../../../../common/constants/system';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ConfigService } from '../../../../../shared/services/config.service';
import { MailEvent } from '../../../events/mail.event';
import { ForgotPasswordDto } from '../../../infrastructures/dtos/user/forgotPassword.dto';
import { UserMap } from '../../../mapper/user.mapper';
import { UserRepository } from '../../../repositories/user.repo';
import { GetUserErrors } from '../user.error';

type Response = Either<
  AppError.UnexpectedError | GetUserErrors.UserNotFound,
  Result<boolean>
>;

@Injectable()
export class ForgotPasswordUseCase implements IUseCase<ForgotPasswordDto, Promise<Response>> {
	constructor(
		@Inject('UserRepository') public readonly repo: UserRepository,
		public configService: ConfigService,
		private event: EventEmitter2
	) { }

	async execute(dto: ForgotPasswordDto): Promise<Response> {
		let user = await this.repo.findOneBy({
			username: dto.username,
			email: dto.email,
			firstName: dto.firstName,
			lastName: dto.lastName
		});
		if (!user) {
			return left(new GetUserErrors.UserNotFound());
		}

		const password = generator.generate(
			{
				length: 10,
				numbers: true,
				lowercase: true,
				uppercase: true
			});
		user.hashPassword(password);
		const entity = UserMap.toEntity(user);
		entity.updatedBy = SYSTEM;
		user = await this.repo.save(entity);
		this.event.emit('password.reset', new MailEvent(password, user.email));

		return right(Result.ok(true));
	}
}
