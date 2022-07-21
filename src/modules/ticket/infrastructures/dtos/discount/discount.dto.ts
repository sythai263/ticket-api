import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

import { ProgramDto } from '../program';

export class DiscountDto{

	@ApiProperty({
		example: 123
	})
		id: number;

	@ApiProperty({
		example: 'DELOTTO',
		description:'Code giảm giá'
	})
	@MaxLength(15,{
		message:'Code không dài hơn 15 ký tự'
	})
	@IsString()
		code: string;

	@ApiProperty({
		type: ProgramDto,
		description:'Thông tin chương trình'
	})
		program: ProgramDto;

	@ApiProperty({
		example: new Date(),
		description:'Thời gian bắt đầu'
	})
		startDate: Date;

	@ApiProperty({
		example: new Date(),
		description:'Thời gian kết thúc'
	})
		expiredDate: Date;

	@ApiProperty({
		example: 5,
		description:'Đơn vị tính %'
	})
	@IsNumber()
	@Max(100, {
		message:'Giá trị giảm giá không được quá 100%'
	})
	@Min(0)
		discount: number;

	@ApiProperty({
		example: 'Mô tả mã giảm giá',
		description:'Mô tả về mã giảm giá'
	})
	@IsString()
		description: string;

}
