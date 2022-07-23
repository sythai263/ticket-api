import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageMetaDto } from '../../../../../common/dto/PageMetaDto';
import { AttendeeDto } from './attendee.dto';

export class PaginationAttendeeDto{
	@ApiProperty({
		isArray: true,
		type: AttendeeDto,
		description: 'Danh sách tham gia'
	})
		data: AttendeeDto[];

	@ApiPropertyOptional({
		description: 'Thông tin phân trang dữ liệu'
	})
		meta: PageMetaDto;

	constructor(data: AttendeeDto[], meta?: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
