import { Inject, Injectable } from '@nestjs/common';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { PaginationProgramDto } from '../../../infrastructures/dtos/program';
import { SearchProgramDto } from '../../../infrastructures/dtos/program/searchProgram.dto';
import { ProgramMap } from '../../../mapper/program.mapper';
import { ProgramRepository } from '../../../repositories/program.repo';
import { ProgramErrors } from '../program.error';

type Response = Either<
	AppError.UnexpectedError | ProgramErrors.NotFound | ProgramErrors.Error,
	Result<PaginationProgramDto>
>;

@Injectable()
export class GetProgramsUsecase implements IUseCase<SearchProgramDto, Promise<Response>> {
	constructor(@Inject('ProgramRepository') public readonly repo: ProgramRepository) {}

	async execute(dto: SearchProgramDto): Promise<Response> {
		const result = await this.repo.search(dto);
		if (!result) {
			return left(new ProgramErrors.Error('Không tìm thấy chương trình này!'));
		}

		const data = ProgramMap.toDtos(result[0]);
		const meta = new PageMetaDto(dto, result[1]);
		const response = new PaginationProgramDto(data, meta);

		return right(Result.ok(response));
	}
}
