'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AbstractSearchDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  	page: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  	take = 10;

  get skip(): number {
  	return (this.page - 1) * this.take;
  }
}
