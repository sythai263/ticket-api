import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { ReviewProgramDto } from './reviewProgram.dto';

export class PaginationReviewProgramDto {
	@ApiProperty({
		isArray: true,
		type: ReviewProgramDto,
	})
	data: ReviewProgramDto[];

	@ApiPropertyOptional()
	meta: PageMetaDto;

	constructor(data: ReviewProgramDto[], meta?: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
