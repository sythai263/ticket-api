import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsString, Min } from 'class-validator';

import { CurrencyCode } from '../../../../../common/constants/currencyCode';

export class CreateInvoiceDto{
	@ApiProperty({
		example: 20000
	})
	@IsNumber()
	@Min(0, {
		message:'Amount must be > 0'
	})
		amount: number;

	@ApiProperty({
		example: CurrencyCode.VND,
		enum: CurrencyCode
	})
	@IsEnum(CurrencyCode)
		currencyCode?: CurrencyCode;

	@ApiProperty({
		example: 'VPB'
	})
	@IsString()
		bankCode?: string;

	@ApiProperty({
		example: '1920323430'
	})
	@IsString()
		bankTransNo?: string;

	@ApiProperty({
		example: 'ATM'
	})
	@IsString()
		cardType?: string;

	@ApiProperty({
		example: new Date()
	})
	@IsDateString()
		payDate?: Date;

	@ApiProperty({
		example: 'Thanh toán đơn hàng XXX '
	})
	@IsString()
		info?: string;

}
