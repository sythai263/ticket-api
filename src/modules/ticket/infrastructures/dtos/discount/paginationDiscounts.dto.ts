import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { DiscountDto } from './discount.dto';

export class PaginationDiscountDto{
	@ApiProperty({
		isArray: true,
		type: DiscountDto
	})
		data: DiscountDto[];

	@ApiPropertyOptional()
		meta: PageMetaDto;

	constructor(data: DiscountDto[], meta?: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
