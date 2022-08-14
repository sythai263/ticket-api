import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProgramDto {
	id?: number;

	@ApiPropertyOptional({
		example: 'Tên sự kiện',
	})
	@IsString({
		message: ' Tên sự kiện phải là một chuỗi !',
	})
	@IsOptional()
	name?: string;

	@ApiPropertyOptional({
		example: new Date(),
	})
	@IsOptional()
	@IsDateString({
		message: ' Ngày bắt đầu không hợp lệ',
	})
	// @MinDate(moment().add(1, 'd').toDate())
	startDate?: Date;

	@ApiPropertyOptional({
		example: new Date(),
	})
	@IsOptional()
	@IsDateString({
		message: ' Ngày kết thúc không hợp lệ',
	})
	// @MinDate(moment().add(1, 'd').toDate())
	endDate?: Date;

	@ApiPropertyOptional({
		example: 150,
		minimum: 1,
	})
	@IsInt({
		message: ' Số lượng người tham gia phải là 1 số nguyên',
	})
	@Min(1, {
		message: 'Tổng số lượng người tham gia phải lớn hơn 1',
	})
	@IsOptional()
	total?: number;

	@ApiPropertyOptional({
		example: 99000,
		default: 0,
		minimum: 0,
	})
	@IsInt()
	@Min(0, {
		message: 'Giá tiền phải là số dương !',
	})
	@IsOptional()
	price? = 0;

	@ApiPropertyOptional({
		example: 'Địa điểm tổ chức',
	})
	@IsOptional()
	@IsString({
		message: ' Địa điểm sự kiện phải là 1 chuỗi',
	})
	place?: string;

	@ApiPropertyOptional({
		example: 'http://localhost/avatar',
	})
	@IsString({
		message: ' Avatar sự kiện phải là 1 chuỗi',
	})
	@IsOptional()
	avatar?: string;

	@ApiPropertyOptional({
		example: 'Mô tả sự kiện',
	})
	@IsOptional()
	@IsString({
		message: 'Mô tả sự kiện phải là 1 chuỗi',
	})
	description?: string;
}
