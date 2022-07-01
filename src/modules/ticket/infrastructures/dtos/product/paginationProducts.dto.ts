import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { ProductDto } from './product.dto';

export class PaginationProductDto{
	@ApiProperty({
		isArray: true,
		type: ProductDto
	})
		data: ProductDto[];

	@ApiPropertyOptional()
		meta: PageMetaDto;

	constructor(data: ProductDto[], meta?: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
