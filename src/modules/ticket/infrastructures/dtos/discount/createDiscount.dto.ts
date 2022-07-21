import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateDiscountDto{

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
		example: 10,
		description:'Mã chương trình'
	})
	@IsNumber()
		programId: number;

	@ApiProperty({
		example: new Date(),
		description:'Thời gian bắt đầu'
	})
	@IsDateString()
		startDate: Date;

	@ApiProperty({
		example: new Date(),
		description:'Thời gian kết thúc'
	})
	@IsDateString()
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
