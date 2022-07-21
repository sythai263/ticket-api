import {
	BadRequestException,
	Body,
	Controller, HttpCode,
	HttpStatus,
	InternalServerErrorException, Post, Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { Roles } from '../../../../decorators/Roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import {
	ProgramDto
} from '../../infrastructures/dtos/program/';
import { CreatePurchaseDto, PurchaseDto } from '../../infrastructures/dtos/purchase';
import { CreateOrderUsecase } from './create/createOrder.usecase';
import { PurchaseErrors } from './purchase.error';

@Controller('api/purchase')
@ApiTags('Purchase')
export class PurchaseController {
	constructor(
		public readonly createPurchase: CreateOrderUsecase,
	) { }

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Tạo đơn mua hàng',
		summary:'Tạo đơn mua hàng'
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.USER)
	@ApiResponse({
		type: ProgramDto
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async execute(@Req() req: Request, @Body() dto: CreatePurchaseDto): Promise<PurchaseDto> {
		const user = req.user as JwtPayload;
		const result = await this.createPurchase.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case PurchaseErrors.Error:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

}
