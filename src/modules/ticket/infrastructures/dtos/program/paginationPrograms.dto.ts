import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { ProgramDto } from './program.dto';

export class PaginationProgramDto{
	@ApiProperty({
		isArray: true,
		type: ProgramDto
	})
		data: ProgramDto[];

	@ApiPropertyOptional()
		meta: PageMetaDto;

	constructor(data: ProgramDto[], meta?: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
