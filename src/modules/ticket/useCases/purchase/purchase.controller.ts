import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	HttpCode,
	HttpStatus,
	InternalServerErrorException,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { Roles } from '../../../../decorators/Roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { CreatePurchaseDto, PurchaseDto } from '../../infrastructures/dtos/purchase';
import { CreateOrderUsecase } from './create/createOrder.usecase';
import { PurchaseErrors } from './purchase.error';
import { ChangeStatusOrderUsecase } from './update/adminChangeStatus.usecase';
import { UserReceivedOrderUsecase } from './update/userChangeStatus.usecase';

@Controller('api/purchase')
@ApiTags('Purchase')
export class PurchaseController {
	constructor(public readonly createPurchase: CreateOrderUsecase, public readonly admin: ChangeStatusOrderUsecase, public readonly user: UserReceivedOrderUsecase) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Tạo đơn mua hàng',
		summary: 'Tạo đơn mua hàng',
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.USER)
	@ApiResponse({
		type: PurchaseDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
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

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Thay đổi trạng thái đơn hàng',
		summary: 'Thay đổi trạng thái đơn hàng',
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: PurchaseDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async adminChangeStatus(@Req() req: Request, @Param('id') id: number): Promise<PurchaseDto> {
		const user = req.user as JwtPayload;
		const result = await this.admin.execute(id, user.id);
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

	@Patch('receive/:id')
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Thay đổi trạng thái đơn hàng',
		summary: 'Thay đổi trạng thái đơn hàng',
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.USER)
	@ApiResponse({
		type: PurchaseDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async userChangeStatus(@Req() req: Request, @Param('id') id: number): Promise<PurchaseDto> {
		const user = req.user as JwtPayload;
		const result = await this.user.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case PurchaseErrors.Error:
					throw new BadRequestException(err.errorValue());
				case PurchaseErrors.NotFound:
					throw new BadRequestException(err.errorValue());
				case PurchaseErrors.Forbidden:
					throw new ForbiddenException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}
}
