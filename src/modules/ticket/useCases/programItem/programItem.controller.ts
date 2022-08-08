import {
	BadRequestException,
	Body,
	Controller, Delete, Get, HttpCode,
	HttpStatus,
	InternalServerErrorException, NotFoundException, Param, Patch, Post, Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth, ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
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
import { CreateProgramItemDto, ProgramItemDto, ProgramItemsDto, UpdateProgramItemDto } from '../../infrastructures/dtos/programItem';
import { ProductErrors } from '../products';
import { ProgramErrors } from '../programs';
import { CreateProgramItemUsecase } from './create/createProgramItem.usecase';
import { DeleteProgramItemUsecase } from './delete/deleteProgramItem.usecase';
import { DeleteProgramItemByProgramIdUsecase } from './delete/deleteProgramItemByProgramId.usecase';
import { GetProgramItemUsecase } from './get/getProgramItem.usecase';
import { ProgramItemErrors } from './programItem.error';
import { UpdateProgramItemUsecase } from './update/updateProgramItem.usecase';

@Controller('api/program-items')
@ApiTags('Program item')
export class ProgramItemController {
	constructor(
		public readonly createProduct: CreateProgramItemUsecase,
		public readonly getProducts: GetProgramItemUsecase,
		public readonly updateItem: UpdateProgramItemUsecase,
		public readonly deleteByProgramId: DeleteProgramItemByProgramIdUsecase,
		public readonly deleteItem: DeleteProgramItemUsecase,

	) { }

	@Post()
	@ApiOperation({
		description: 'Thêm các sản phẩm cần bán vào 1 chương trình, sự kiện',
		summary:'Thêm các sản phẩm cần bán vào 1 chương trình, sự kiện'
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: ProgramItemsDto
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

	@ApiNotFoundResponse({
		description: 'Not found'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async execute(
		@Req() req: Request,
		@Body() dto: CreateProgramItemDto): Promise<ProgramItemDto[]> {
		const user = req.user as JwtPayload;
		const result = await this.createProduct.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case ProductErrors.NotFound:
				case ProgramErrors.NotFound:
				case ProgramItemErrors.NotFound:
					throw new NotFoundException(err.errorValue());
				case ProgramItemErrors.Error:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Get('program/:id')
	@ApiOperation({
		description: 'Lấy danh sách sản phẩm bán trong 1 chương trình',
		summary:'Lấy danh sách sản phẩm bán trong 1 chương trình'
	})
	@ApiParam({
		name: 'id',
		description: 'ID của chương trình'
	})
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		type: ProgramItemsDto
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
		@Param('id') id: number): Promise<ProgramItemsDto> {

		const result = await this.getProducts.execute(id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case ProductErrors.Error:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();

	}

	@Patch(':id')
	@ApiOperation({
		description: 'Thay thế 1 sản phẩm nào đó trong chương trình, sự kiện',
		summary:'Thay thế 1 sản phẩm nào đó trong chương trình, sự kiện'
	})
	@ApiParam({
		name: 'id',
		description: 'ID của sản phẩm cũ trong chương trình cần thay thế'
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: ProgramItemDto
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
		@Body() dto: UpdateProgramItemDto
	): Promise<ProgramItemDto> {
		dto.id = id;
		const user = req.user as JwtPayload;
		const result = await this.updateItem.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case ProductErrors.Error:
				case ProgramItemErrors.Error:
					throw new BadRequestException(err.errorValue());
				case ProductErrors.NotFound:
					throw new NotFoundException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();

	}

	@Delete('program/:id')
	@ApiOperation({
		description: 'Xóa toàn bộ sản phẩm trong chương trình',
		summary:'Xóa toàn bộ sản phẩm trong chương trình'
	})
	@ApiParam({
		name: 'id',
		description: 'ID của chương trình cần xóa'
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
	async deleteByProgram(
		@Req() req: Request,
		@Param('id') id: number,
	): Promise<SuccessNotification> {
		const user = req.user as JwtPayload;
		const result = await this.deleteByProgramId.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case ProductErrors.Error:
				case ProductErrors.NotFound:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new SuccessNotification('Delete program successfully !', HttpStatus.CREATED);
	}

	@Delete(':id')
	@ApiOperation({
		description: 'Xóa 1 sản phẩm trong chương trình nào đó',
		summary:'Xóa 1 sản phẩm trong chương trình nào đó'
	})
	@ApiParam({
		name: 'id',
		description: 'ID của sản phẩm trong chương trình'
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
		const result = await this.deleteItem.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case ProgramItemErrors.Error:
				case ProgramItemErrors.NotFound:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new SuccessNotification('Delete program successfully !', HttpStatus.CREATED);
	}
}
