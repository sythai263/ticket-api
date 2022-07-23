
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
export class CreateProgramDto{

	@ApiProperty({
		example: 'Tên sự kiện'
	})
	@IsString()
	@IsNotEmpty({
		message:'Tên chương trình không để trống !'
	})
		name: string;

	@ApiProperty({
		example: new Date()
	})
	@IsDateString()
	@IsNotEmpty({
		message:'Ngày bắt đầu không để trống !'
	})
	// @MinDate(moment().add(1, 'd').toDate())
		startDate?: Date;

	@ApiProperty({
		example: new Date()
	})
	@IsDateString()
	@IsNotEmpty({
		message:'Ngày kết thúc không để trống !'
	})
	// @MinDate(moment().add(1, 'd').toDate())
		endDate?: Date;

	@ApiProperty({
		example: 150,
		minimum: 1
	})
	@IsInt()
	@IsNotEmpty({
		message:'Tổng số lượng người tham gia không để trống !'
	})
	@Min(1,{
		message:'Tổng số lượng người tham gia phải lớn hơn 1'
	})
		total?: number;

	@ApiProperty({
		example: 99000,
		default: 0,
		minimum: 0
	})
	@IsInt()
	@Min(0, {
		message:'Giá tiền phải là số dương !'
	})
		price = 0;

	@ApiProperty({
		example: 'Địa điểm tổ chức'
	})
	@IsString()
	@IsNotEmpty({
		message:'Địa điểm không để trống !'
	})
		place: string;

	@ApiProperty({
		example: 'http://localhost/avatar'
	})
	@IsString()
		avatar?: string;

	@ApiProperty({
		example: 'Mô tả sự kiện'
	})
	@IsString()
		description?: string;

}
