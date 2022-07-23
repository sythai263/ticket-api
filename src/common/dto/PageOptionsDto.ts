import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { Order } from '../constants/order';

export class PageOptionsDto {
  @ApiPropertyOptional({
  	enum: Order,
  	default: Order.ASC,
  	description: 'Sắp xếp id theo',
  })
  @IsEnum(Order)
  @IsOptional()
  	order: Order = Order.ASC;

  @ApiPropertyOptional({
  	minimum: 1,
  	default: 1,
  	description: 'Trang thứ',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  	page?: number = 1;

  @ApiPropertyOptional({
  	minimum: 1,
  	maximum: 500,
  	default: 10,
  	description: 'Số dữ liệu trên 1 trang',
  })
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(500)
  @IsOptional()
  	take?: number = 10;

  get skip(): number {
  	return (this.page - 1) * this.take;
  }
}
