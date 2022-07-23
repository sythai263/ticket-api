import {
	BadRequestException,
	Body,
	Controller, Delete, Get, HttpCode,
	HttpStatus,
	InternalServerErrorException, NotFoundException, Param, Patch, Post, Query, Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { SuccessNotification } from '../../../../core/infra/Success';
import { Roles } from '../../../../decorators/Roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { CreateDiscountDto, DiscountDto, PaginationDiscountDto, SearchDiscountDto, UpdateDiscountDto } from '../../infrastructures/dtos/discount';
import {
	ProgramDto
} from '../../infrastructures/dtos/program/';
import { ProgramErrors } from '../programs';
import { CreateDiscountUsecase } from './create/createDiscount.usecase';
import { DeleteDiscountUsecase } from './delete/deleteDiscount.usecase';
import { DiscountErrors } from './discount.error';
import { GetDiscountUsecase } from './get/getDiscount.usecase';
import { GetDiscountByIdUsecase } from './get/getDiscountById.usecase';
import { UpdateDiscountUsecase } from './update/updateDiscount.usecase';

@Controller('api/discount')
@ApiTags('Discount')
export class DiscountController {
	constructor(
		public readonly createDiscount: CreateDiscountUsecase,
		public readonly getDiscount: GetDiscountUsecase,
		public readonly getDiscountById: GetDiscountByIdUsecase,
		public readonly updateDiscount: UpdateDiscountUsecase,
		public readonly deleteDiscount: DeleteDiscountUsecase,
	) { }

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Thêm mã giảm giá',
		summary:'Thêm mã giảm giá'
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
	async execute(@Req() req: Request, @Body() dto: CreateDiscountDto): Promise<DiscountDto> {
		const user = req.user as JwtPayload;
		const result = await this.createDiscount.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case DiscountErrors.Error:
				throw new BadRequestException(err.errorValue());
			case DiscountErrors.NotFound:
			case ProgramErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Get()
	@ApiOperation({
		description: 'Lấy danh sách các mã giảm giá',
		summary:'Lấy danh sách các mã giảm giá'
	})
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		type: PaginationDiscountDto,
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async search(
		@Req() req: Request,
		@Query() dto: SearchDiscountDto): Promise<PaginationDiscountDto> {

		const result = await this.getDiscount.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case DiscountErrors.Error:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Get(':id')
	@ApiParam({
		name: 'id',
		description:'Mã của sản phẩm'
	})
	@ApiOperation({
		description: 'Lấy thồng tin về mã giảm giá qua id',
		summary:'Lấy thồng tin về mã giảm giá qua id'
	})
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		type: DiscountDto
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getById(
		@Req() req: Request,
		@Param('id') id: number): Promise<DiscountDto> {

		const result = await this.getDiscountById.execute(id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case DiscountErrors.Error:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Patch(':id')
	@ApiParam({
		name: 'id',
		description:'ID của mã giảm giá'
	})
	@ApiOperation({
		description: 'Cập nhật thông tin 1 mã giảm giá',
		summary:'Cập nhật thông tin 1 mã giảm giá'
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: DiscountDto
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
	async updateById(
		@Req() req: Request,
		@Param('id') id: number,
		@Body() dto: UpdateDiscountDto
	): Promise<DiscountDto> {
		dto.id = id;
		const user = req.user as JwtPayload;
		const result = await this.updateDiscount.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case DiscountErrors.Error:
				throw new BadRequestException(err.errorValue());
			case DiscountErrors.NotFound:
			case ProgramErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();

	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		description:'ID của mã giảm giá'
	})
	@ApiOperation({
		description: 'Xóa thông tin của 1 mã giảm giá',
		summary:'Xóa thông tin của 1 mã giảm giá'
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiResponse({
		type: SuccessNotification
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
	async delete(
		@Req() req: Request,
		@Param('id') id: number,
	): Promise<SuccessNotification> {
		const user = req.user as JwtPayload;
		const result = await this.deleteDiscount.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case DiscountErrors.Error:
				throw new BadRequestException(err.errorValue());
			case DiscountErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new SuccessNotification('Đã xóa sản phẩm', HttpStatus.CREATED);
	}
}
