import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { ProgramDomain } from '../../../../../domain/program.domain';
import { CreateProgramDto } from '../../../infrastructures/dtos/program/createProgram.dto';
import { ProgramDto } from '../../../infrastructures/dtos/program/program.dto';
import { UpdateProgramDto } from '../../../infrastructures/dtos/program/updateProgram.dto';
import { ProgramMap } from '../../../mapper/program.mapper';
import { ProgramRepository } from '../../../repositories/program.repo';
import { ProgramErrors } from '../program.error';

type Response = Either<AppError.UnexpectedError | ProgramErrors.NotFound | ProgramErrors.Error, Result<ProgramDto>>;

@Injectable()
export class UpdateProgramUsecase implements IUseCase<CreateProgramDto, Promise<Response>> {
	constructor(@Inject('ProgramRepository') public readonly repo: ProgramRepository) {}

	async execute(dto: UpdateProgramDto, userId: number): Promise<Response> {
		const domain = await this.repo.findOne({
			where: {
				id: dto.id,
			},
			relations: ['attendees'],
		});
		if (!domain) {
			return left(new ProgramErrors.NotFound());
		}

		if (!domain.checkCanUpdate()) {
			return left(new ProgramErrors.Error('Không thể sửa chương trình này, bỏi vì đã hoàn thành rồi!'));
		}

		if (!domain.checkQuantity(dto.total)) {
			return left(new ProgramErrors.Error('Số lượng không được nhỏ hơn số người đã đăng ký !'));
		}

		const change = this.checkChange(domain, dto);
		if (!change.changePrice(dto.price)) {
			return left(new ProgramErrors.Error('Không thể thay đổi phí tham gia khi đã có người đăng ký!'));
		}

		const entity = ProgramMap.toEntity(change);
		entity.updatedBy = userId;
		const update = await this.repo.save(entity);

		return right(Result.ok(ProgramMap.toDto(update)));
	}

	checkChange(domain: ProgramDomain, dto: UpdateProgramDto): ProgramDomain {
		domain.changeAmount(dto.total);
		domain.changeAvatar(dto.avatar);
		domain.changeDescription(dto.description);
		domain.changeEndDate(dto.endDate);
		domain.changeName(dto.name);
		domain.changeStartDate(dto.startDate);
		return domain;
	}
}
