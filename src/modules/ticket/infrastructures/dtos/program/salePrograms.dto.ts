import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SaleProgramDto {
	@ApiPropertyOptional({
		example: '1000000',
	})
	@IsOptional()
	sumMoney?: number;

	@ApiPropertyOptional({
		example: '1000000',
	})
	@IsOptional()
	paidMoney?: number;

	@ApiPropertyOptional({
		example: 15,
	})
	quantity?: number;

	@ApiPropertyOptional({
		example: 10,
	})
	amountCheckIn?: number;

	@ApiPropertyOptional({
		example: 100,
	})
	total: number;

	@ApiPropertyOptional({
		example: 21,
	})
	amountRate: number;

	@ApiPropertyOptional({
		example: 4.6,
	})
	avgStar: number;
}
