import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { InvoiceDto } from './invoice.dto';

export class PaginationInvoiceDto{
	@ApiProperty({
		isArray: true,
		type: InvoiceDto
	})
		data: InvoiceDto[];

	@ApiPropertyOptional()
		meta: PageMetaDto;

	constructor(data: InvoiceDto[], meta?: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
