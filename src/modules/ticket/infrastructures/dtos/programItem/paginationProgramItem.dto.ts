import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { ProgramItemDto } from './programItem.dto';

export class PaginationProgramItemDto{
	@ApiProperty({
		isArray: true,
		type: ProgramItemDto
	})
		data: ProgramItemDto[];

	@ApiPropertyOptional()
		meta: PageMetaDto;

	constructor(data: ProgramItemDto[], meta?: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
