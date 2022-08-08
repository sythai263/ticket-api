import { Inject, Injectable } from '@nestjs/common';

import { ModeImage } from '../../../../../common/constants/modeImage';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { saveImage } from '../../../../../utils/saveImage';
import { ProgramDto } from '../../../infrastructures/dtos/program';
import { ProgramMap } from '../../../mapper';
import { ProgramRepository } from '../../../repositories';
import { ProgramErrors } from '../program.error';

type Response = Either<AppError.UnexpectedError | ProgramErrors.NotFound, Result<ProgramDto>>;

@Injectable()
export class ChangeAvatarProgramUseCase implements IUseCase<Express.Multer.File, Promise<Response>> {
	constructor(@Inject('ProgramRepository') public readonly repo: ProgramRepository) {}

	async execute(avatar: Express.Multer.File, userId: number): Promise<Response> {
		const program = await this.repo.findById(userId);
		if (!program) {
			return left(new ProgramErrors.NotFound());
		}

		const url = await saveImage(avatar, ModeImage.AVATAR);
		program.avatar = url;
		const entity = ProgramMap.toEntity(program);
		entity.updatedBy = userId;
		await this.repo.save(entity);
		return right(Result.ok(ProgramMap.toDto(program)));
	}
}
